import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as Icons from '../icons/icons'
import { decoracao } from '../assets/LoginRegistro/Decoracao/decoracao.js'
import Fundo from '../assets/LoginRegistro/Fundo.png'
import { motion } from "framer-motion";

function TelaRegistro() {
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const preencherAutomatico = () => {
        setNome('Eduardo');
        setEmail(`teste@gmail.com`);
        setSenha('123456');
        setConfirmarSenha('123456');
    };

    const handleRegistro = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        setCarregando(true);

        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    telefone: ""
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                setErro(dados.erro || 'Erro ao realizar o cadastro.');
            } else {
                setSucesso('Conta criada com sucesso! Redirecionando...');
                setNome('');
                setEmail('');
                setSenha('');
                setConfirmarSenha('');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            setErro('Não foi possível conectar ao servidor.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <>
            <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-900">
                <img src={Fundo} className="absolute inset-0 w-full h-full object-cover z-0" />

                <div className="absolute inset-0 z-10 pointer-events-none">
                    {decoracao.map((src, index) => (
                        <motion.img
                            key={index}
                            src={src}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 0.9 }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 * (index * 2 + 1) }}
                            whileHover={{ scale: 1.05, x: 10 }}
                            className="absolute top-0 left-0 h-full w-auto object-cover"
                        />
                    ))}
                </div>

                <main className="relative z-20 bg-white p-10 shadow-2xl w-[90%] max-w-md rounded-xl">
                    <h2 className="text-2xl font-bold text-center mb-8 text-preto-principal">
                        Faça{' '} <span onClick={preencherAutomatico} className="text-beje-principal cursor-pointer" title="Clique para preencher automaticamente">
                            Registro
                        </span>
                        {' '}da sua conta
                    </h2>
                    <form onSubmit={handleRegistro} className="flex flex-col gap-5">

                        {erro && (
                            <div className="bg-red-100 text-red-700 text-xs font-bold px-3 py-2 rounded-lg border border-red-200">
                                {erro}
                            </div>
                        )}
                        {sucesso && (
                            <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-2 rounded-lg border border-green-200">
                                {sucesso}
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-cinza-texto-secundario ml-1">Nome</label>
                            <div className="flex items-center border border-borda-preta-opaca rounded-lg px-3 py-2.5 focus-within:border-beje-principal transition-all bg-white text-preto-principal">
                                <input
                                    type="text"
                                    placeholder="Seu Nome Completo"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                    className="w-full outline-none text-sm bg-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-cinza-texto-secundario ml-1">Email</label>
                            <div className="flex items-center border border-borda-preta-opaca rounded-lg px-3 py-2.5 focus-within:border-beje-principal transition-all bg-white text-preto-principal">
                                <input
                                    type="email"
                                    placeholder="exemplo@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full outline-none text-sm bg-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-cinza-texto-secundario ml-1">Senha</label>
                            <div className="flex items-center border border-borda-preta-opaca rounded-lg px-3 py-2.5 focus-within:border-beje-principal transition-all bg-white text-preto-principal">
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Coloque sua Senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                    className="w-full outline-none text-sm bg-transparent"
                                />
                                <div onClick={() => setMostrarSenha(!mostrarSenha)} className="cursor-pointer text-cinza-texto-secundario hover:text-beje-principal transition-colors">
                                    {mostrarSenha ? <Icons.FiEyeOff size={22} /> : <Icons.FiEye size={22} />}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-cinza-texto-secundario ml-1">Confirmar Senha</label>
                            <div className="flex items-center border border-borda-preta-opaca rounded-lg px-3 py-2.5 focus-within:border-beje-principal transition-all bg-white text-preto-principal">
                                <input
                                    type={mostrarConfirmarSenha ? "text" : "password"}
                                    placeholder="Confirme sua Senha"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    required
                                    className="w-full outline-none text-sm bg-transparent"
                                />
                                <div onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} className="cursor-pointer text-cinza-texto-secundario hover:text-beje-principal transition-colors">
                                    {mostrarConfirmarSenha ? <Icons.FiEyeOff size={22} /> : <Icons.FiEye size={22} />}
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={carregando} className="w-full bg-beje-principal text-white font-bold py-3 rounded-lg mt-2 hover:bg-botao-beje-apertado transition-colors shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                            {carregando ? 'Registrando...' : 'Registrar-se'}
                        </button>

                        <p className="text-center text-xs font-medium text-cinza-texto-secundario mt-2">
                            Já Tem Conta?{' '}
                            <span onClick={() => navigate('/login')} className="text-beje-principal cursor-pointer hover:underline font-bold">
                                Faça Login
                            </span>
                        </p>
                    </form>
                </main>
            </div>
        </>
    )
}

export default TelaRegistro