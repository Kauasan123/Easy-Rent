
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from '../icons/icons';
import { decoracao } from '../assets/LoginRegistro/Decoracao/decoracao.js';
import Fundo from '../assets/LoginRegistro/Fundo.png';
import { motion } from 'framer-motion';

function TelaLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            const resposta = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        senha
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                setErro(
                    dados.erro || 'E-mail ou senha incorretos.'
                );
                return;
            }

            if (!dados.token || !dados.usuario) {
                setErro('O servidor retornou uma resposta inválida.');
                return;
            }

            sessionStorage.setItem('token', dados.token);
            sessionStorage.setItem('usuarioId', String(dados.usuario.id));
            sessionStorage.setItem('usuarioNome', dados.usuario.nome);
            sessionStorage.setItem('usuarioAvatar', dados.usuario.avatarPath || '');

            navigate('/principal');
        } catch (error) {
            console.error('Erro ao realizar login:', error);

            setErro(
                'Não foi possível conectar ao servidor.'
            );
        } finally {
            setCarregando(false);
        }
    };

    return (
        <>
            <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-900">
                <img src={Fundo} alt="" className="absolute inset-0 w-full h-full object-cover z-0" />

                <div className="absolute inset-0 z-10 pointer-events-none">
                    {decoracao.map((src, index) => (
                        <motion.img key={index} src={src} alt="" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 0.9 }} transition={{
                            duration: 1.5,
                            ease: 'easeOut',
                            delay: 0.1 * (index * 2 + 1)
                        }} whileHover={{
                            scale: 1.05,
                            x: 10
                        }} className="absolute top-0 left-0 h-full w-auto object-cover"
                        />
                    ))}
                </div>

                <main className="relative z-20 bg-white p-10 shadow-2xl w-[90%] max-w-md rounded-xl">
                    <h2 className="text-2xl font-bold text-center mb-8 text-preto-principal">
                        Faça{' '}
                        <span className="text-beje-principal">
                            Login
                        </span>{' '}
                        com sua conta
                    </h2>

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        {erro && (
                            <div role="alert" className="bg-red-100 text-red-700 text-xs font-bold px-3 py-2 rounded-lg border border-red-200">
                                {erro}
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-xs font-semibold text-cinza-texto-secundario ml-1">
                                Email
                            </label>

                            <div className="flex items-center border border-borda-preta-opaca rounded-lg px-3 py-2.5 focus-within:border-beje-principal transition-all bg-white text-preto-principal">
                                <input id="email" type="email" placeholder="exemplo@gmail.com" value={email} onChange={(e) =>
                                    setEmail(e.target.value)
                                } autoComplete="email" required className="w-full outline-none text-sm bg-transparent" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="senha" className="text-xs font-semibold text-cinza-texto-secundario ml-1">
                                Senha
                            </label>

                            <div className="flex items-center border border-borda-preta-opaca rounded-lg px-3 py-2.5 focus-within:border-beje-principal transition-all bg-white text-preto-principal">
                                <input id="senha" type={mostrarSenha ? 'text' : 'password'} placeholder="Coloque sua Senha" value={senha} onChange={(e) =>
                                    setSenha(e.target.value)
                                } autoComplete="current-password" required className="w-full outline-none text-sm bg-transparent" />

                                <button type="button" onClick={() =>
                                    setMostrarSenha(!mostrarSenha)
                                } aria-label={
                                    mostrarSenha
                                        ? 'Ocultar senha'
                                        : 'Mostrar senha'
                                } className="cursor-pointer text-cinza-texto-secundario hover:text-beje-principal transition-colors">
                                    {mostrarSenha ? (
                                        <Icons.FiEyeOff size={22} />
                                    ) : (
                                        <Icons.FiEye size={22} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={carregando} className="w-full bg-beje-principal text-white font-bold py-3 rounded-lg mt-2 hover:bg-botao-beje-apertado transition-colors shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                            {carregando ? 'Carregando...' : 'Login'}
                        </button>

                        <p className="text-center text-xs font-medium text-cinza-texto-secundario mt-2">
                            Não Tem Conta?{' '}
                            <span onClick={() => navigate('/registro')} className="text-beje-principal cursor-pointer hover:underline font-bold">
                                Registre-se
                            </span>
                        </p>
                    </form>
                </main>
            </div>
        </>
    );
}

export default TelaLogin;
