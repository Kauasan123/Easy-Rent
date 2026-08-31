import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from '../icons/icons';
import { motion, AnimatePresence } from 'framer-motion';

function Perfil() {
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');

    const [fotoUrl, setFotoUrl] = useState('');

    const [editando, setEditando] = useState({
        nome: false,
        email: false,
        telefone: false,
        senha: false
    });

    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        const usuarioId = localStorage.getItem('usuarioId');

        if (!usuarioId) {
            navigate('/login');
            return;
        }

        const buscarDadosDoBanco = async () => {
            try {
                const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${usuarioId}`);
                if (resposta.ok) {
                    const dados = await resposta.json();
                    setNome(dados.nome || '');
                    setEmail(dados.email || '');
                    setTelefone(dados.telefone || '');

                    if (dados.avatarPath) {
                        setFotoUrl(dados.avatarPath);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar perfil do usuário", error);
            }
        };

        buscarDadosDoBanco();
    }, [navigate]);

    const alternarEdicao = (campo) => {
        setEditando(prev => ({ ...prev, [campo]: !prev[campo] }));
        if (campo === 'senha' && editando.senha) {
            setSenha('');
        }
    };

    const handleTrocarFoto = async (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        if (!arquivo.type.startsWith('image/')) {
            setMensagem({ texto: 'Por favor, selecione um arquivo de imagem.', tipo: 'erro' });
            return;
        }

        setCarregando(true);
        const usuarioId = localStorage.getItem('usuarioId');

        const formData = new FormData();
        formData.append('avatar', arquivo);

        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${usuarioId}/avatar`, {
                method: 'PUT',
                body: formData
            });

            if (resposta.ok) {
                const dados = await resposta.json();
                setFotoUrl(dados.avatarPath);
                setMensagem({ texto: 'Foto de perfil updated com sucesso!', tipo: 'sucesso' });

                window.dispatchEvent(new Event('focus'));
            } else {
                setMensagem({ texto: 'Erro ao enviar a imagem para o servidor.', tipo: 'erro' });
            }
        } catch (error) {
            setMensagem({ texto: 'Erro de conexão ao enviar imagem.', tipo: 'erro' });
        } finally {
            setCarregando(false);
            setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
        }
    };

    const handleSalvar = async () => {
        setCarregando(true);
        const usuarioId = localStorage.getItem('usuarioId');

        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${usuarioId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, telefone, senha })
            });

            if (resposta.ok) {
                const dadosAtualizados = await resposta.json();

                localStorage.setItem('usuarioNome', dadosAtualizados.usuario.nome);

                setMensagem({ texto: 'Perfil atualizado com sucesso!', tipo: 'sucesso' });
                setEditando({ nome: false, email: false, telefone: false, senha: false });
                setSenha('');
            } else {
                setMensagem({ texto: 'Erro ao atualizar o perfil.', tipo: 'erro' });
            }
        } catch (error) {
            setMensagem({ texto: 'Erro de conexão com o servidor.', tipo: 'erro' });
        } finally {
            setCarregando(false);
            setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
        }
    };

    const handleSair = () => {
        localStorage.removeItem('usuarioId');
        localStorage.removeItem('usuarioNome');
        navigate('/login');
    };

    return (
        <>
            <div className="px-12 py-10 flex flex-col gap-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className='text-preto-texto-principal text-3xl font-bold'>Perfil</h1>
                        <p className='text-cinza-texto-secundario'>Aba para Editar seu Perfil</p>
                    </div>

                    <AnimatePresence>
                        {mensagem.texto && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`px-4 py-2 rounded-lg font-bold text-sm shadow-md ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}
                            >
                                {mensagem.texto}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <section className="flex flex-col gap-4">
                    <div className='border border-borda-cards bg-fundo-cards rounded-3xl overflow-hidden shadow-sm'>
                        <div className="p-6 pb-2">
                            <h2 className='text-2xl font-bold text-preto-texto-principal'>Informações Pessoais</h2>
                        </div>

                        <div className="p-8 pt-4 flex flex-col md:flex-row gap-12 items-start">
                            <div className="flex flex-col items-center gap-2">
                                <input
                                    type="file"
                                    id="input-avatar"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleTrocarFoto}
                                    disabled={carregando}
                                />

                                <div
                                    onClick={() => document.getElementById('input-avatar').click()}
                                    className="w-40 h-40 rounded-full bg-cinza-claro border-2 border-borda-cards flex items-center justify-center overflow-hidden relative group cursor-pointer shadow-inner"
                                >
                                    {fotoUrl ? (
                                        <img
                                            src={fotoUrl}
                                            alt="Foto de perfil do usuário"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <Icons.FaImage size={40} className="text-cinza-texto-secundario opacity-40 group-hover:scale-110 transition-transform duration-300" />
                                    )}

                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
                                </div>

                                <button
                                    onClick={() => document.getElementById('input-avatar').click()}
                                    className="text-beje-principal font-bold text-sm underline-offset-4 hover:underline disabled:opacity-50"
                                    disabled={carregando}
                                >
                                    {carregando ? 'Enviando...' : 'Alterar Foto'}
                                </button>
                            </div>

                            <div className="flex-1 w-full flex flex-col gap-5">
                                <div className="flex flex-col gap-1">
                                    <label className="text-preto-texto-principal font-semibold text-sm">Nome</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            disabled={!editando.nome}
                                            className={`flex-1 bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-beje-principal transition-colors ${!editando.nome ? 'text-preto-texto-principal/50 bg-gray-50' : 'text-preto-texto-principal'}`}
                                        />
                                        <button
                                            onClick={() => alternarEdicao('nome')}
                                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all ${editando.nome ? 'border-red-400 text-red-500 hover:bg-red-50' : 'border-beje-principal text-beje-principal hover:text-branco-texto-principal hover:bg-beje-principal'}`}
                                        >
                                            {editando.nome ? <Icons.FiEyeOff size={12} /> : <Icons.FaPencilAlt size={12} />}
                                            {editando.nome ? 'Cancelar' : 'Editar'}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-preto-texto-principal font-semibold text-sm">E-mail</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={!editando.email}
                                            className={`flex-1 bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-beje-principal transition-colors ${!editando.email ? 'text-preto-texto-principal/50 bg-gray-50' : 'text-preto-texto-principal'}`}
                                        />
                                        <button
                                            onClick={() => alternarEdicao('email')}
                                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all ${editando.email ? 'border-red-400 text-red-500 hover:bg-red-50' : 'border-beje-principal text-beje-principal hover:text-branco-texto-principal hover:bg-beje-principal'}`}
                                        >
                                            {editando.email ? <Icons.FiEyeOff size={12} /> : <Icons.FaPencilAlt size={12} />}
                                            {editando.email ? 'Cancelar' : 'Editar'}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-preto-texto-principal font-semibold text-sm">Telefone</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={telefone}
                                            onChange={(e) => setTelefone(e.target.value)}
                                            placeholder="(00) 00000-0000"
                                            disabled={!editando.telefone}
                                            className={`flex-1 bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-beje-principal transition-colors ${!editando.telefone ? 'text-preto-texto-principal/50 bg-gray-50' : 'text-preto-texto-principal'}`}
                                        />
                                        <button
                                            onClick={() => alternarEdicao('telefone')}
                                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all ${editando.telefone ? 'border-red-400 text-red-500 hover:bg-red-50' : 'border-beje-principal text-beje-principal hover:text-branco-texto-principal hover:bg-beje-principal'}`}
                                        >
                                            {editando.telefone ? <Icons.FiEyeOff size={12} /> : <Icons.FaPencilAlt size={12} />}
                                            {editando.telefone ? 'Cancelar' : 'Editar'}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSalvar}
                                    disabled={carregando}
                                    className="mt-4 bg-beje-principal hover:bg-botao-beje-apertado text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-md disabled:opacity-70"
                                >
                                    <Icons.FaSave size={18} /> {carregando ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-preto-texto-principal">Segurança</h2>
                    <div className="border border-borda-cards bg-fundo-cards rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-4 flex-1 w-full">
                            <div className="w-12 h-12 bg-cinza-claro/50 rounded-full flex items-center justify-center text-cinza-texto-secundario flex-shrink-0">
                                <Icons.IoIosUnlock size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                {editando.senha ? (
                                    <div className="flex flex-col gap-1 w-full max-w-md animate-fadeIn">
                                        <label className="text-preto-texto-principal font-semibold text-sm">Nova Senha</label>
                                        <input
                                            type="password"
                                            value={senha}
                                            onChange={(e) => setSenha(e.target.value)}
                                            placeholder="Digite a nova senha"
                                            className="w-full bg-white border border-borda-cards rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-beje-principal transition-colors text-preto-texto-principal"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <p className="font-bold text-preto-texto-principal">
                                            Senha: <span className="text-lg">**********</span>
                                        </p>
                                        <p className="text-xs text-cinza-texto-secundario">
                                            Altere sua senha regularmente para manter sua conta segura.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => alternarEdicao('senha')}
                            className={`flex items-center gap-2 px-6 py-2 border rounded-xl text-sm font-bold transition-all h-fit ${editando.senha ? 'border-red-400 text-red-500 hover:bg-red-50' : 'border-beje-principal text-beje-principal hover:text-branco-texto-principal hover:bg-beje-principal'}`}
                        >
                            {editando.senha ? <Icons.FiEyeOff size={14} /> : <Icons.FaPencilAlt size={14} />}
                            {editando.senha ? 'Cancelar' : 'Editar'}
                        </button>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-preto-texto-principal">Espaço da Conta</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div onClick={handleSair} className="border border-borda-cards bg-fundo-cards rounded-3xl p-6 flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors shadow-sm">
                            <div className="w-12 h-12 bg-cinza-claro/50 rounded-full flex items-center justify-center text-cinza-texto-secundario">
                                <Icons.FaSignOutAlt size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-preto-texto-principal">Sair</p>
                                <p className="text-xs text-cinza-texto-secundario">Encerrar sessão no dispositivo atual.</p>
                            </div>
                        </div>

                        <div className="border border-red-200 bg-red-50 rounded-3xl p-6 flex items-center gap-4 cursor-pointer hover:bg-red-100 transition-colors shadow-sm">
                            <div className="w-12 h-12 bg-red-200/50 rounded-full flex items-center justify-center text-vermelho-cancelar">
                                <Icons.FaTrashAlt size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-vermelho-cancelar">Excluir Conta</p>
                                <p className="text-xs text-vermelho-cancelar">Essa ação não pode ser desfeita.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Perfil;