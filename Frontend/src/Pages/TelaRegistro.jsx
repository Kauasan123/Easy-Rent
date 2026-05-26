import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as Icons from '../icons/icons'
import { decoracao } from '../assets/LoginRegistro/Decoracao/decoracao.js'
import Fundo from '../assets/LoginRegistro/Fundo.png'
import { motion } from "framer-motion";

function TelaRegistro() {
    const navigate = useNavigate();

    const handleRegistro = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <>
            <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-900">
                {/* 1. Imagens de Fundo */}
                <img src={Fundo} className="absolute inset-0 w-full h-full object-cover z-0" />

                <div className="absolute inset-0 z-10 pointer-events-none">
                    <motion.img
                        src={decoracao[0]}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.9 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                        whileHover={{ scale: 1.05, x: 10 }}
                        className="absolute top-0 left-0 h-full w-auto object-cover"
                    />
                    <motion.img
                        src={decoracao[1]}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.9 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                        whileHover={{ scale: 1.05, x: 10 }}
                        className="absolute top-0 left-0 h-full w-auto object-cover"
                    />
                    <motion.img
                        src={decoracao[2]}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.9 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        whileHover={{ scale: 1.05, x: 10 }}
                        className="absolute top-0 left-0 h-full w-auto object-cover"
                    />
                    <motion.img
                        src={decoracao[3]}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.9 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.7 }}
                        whileHover={{ scale: 1.05, x: 10 }}
                        className="absolute top-0 left-0 h-full w-auto object-cover"
                    />
                    <motion.img
                        src={decoracao[4]}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.9 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.9 }}
                        whileHover={{ scale: 1.05, x: 10 }}
                        className="absolute top-0 left-0 h-full w-auto object-cover"
                    />
                </div>

                {/* 2. Formulário de Login */}
                <main className="relative z-20 bg-white p-10 rounded-2rem shadow-2xl w-[90%] max-w-md rounded-xl">
                    <h2 className="text-2xl font-bold text-center mb-8 text-preto-principal">
                        Faça <span className="text-beje-principal">Registro</span> da sua conta
                    </h2>
                    <form onSubmit={handleRegistro} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-cinza-texto-secundario ml-1">Nome</label>
                            <div className="flex items-center border border-borda-preta-opaca rounded-lg px-3 py-2.5 focus-within:border-beje-principal transition-all bg-white text-preto-principal">
                                <input type="text" placeholder="Seu Nome Completo" className="w-full outline-none text-sm bg-transparent" />
                                <Icons.FiEye className="text-cinza-texto-secundario" size={22} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-cinza-texto-secundario ml-1">Email</label>
                            <div className="flex items-center border border-borda-preta-opaca rounded-lg px-3 py-2.5 focus-within:border-beje-principal transition-all bg-white text-preto-principal">
                                <input type="email" placeholder="exemplo@gmail.com" className="w-full outline-none text-sm bg-transparent" />
                                <Icons.FiEye className="text-cinza-texto-secundario" size={22} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-cinza-texto-secundario ml-1">Senha</label>
                            <div className="flex items-center border border-borda-preta-opaca rounded-lg px-3 py-2.5 focus-within:border-beje-principal transition-all bg-white text-preto-principal">
                                <input type="password" placeholder="Coloque sua Senha" className="w-full outline-none text-sm bg-transparent" />
                                <Icons.FiEye className="text-cinza-texto-secundario cursor-pointer hover:bg-borda-preta-opaca" size={22} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-cinza-texto-secundario ml-1">Confirmar Senha</label>
                            <div className="flex items-center border border-borda-preta-opaca rounded-lg px-3 py-2.5 focus-within:border-beje-principal transition-all bg-white text-preto-principal">
                                <input type="password" placeholder="Confirme sua Senha" className="w-full outline-none text-sm bg-transparent" />
                                <Icons.FiEye className="text-cinza-texto-secundario cursor-pointer hover:bg-borda-preta-opaca" size={22} />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-beje-principal text-white font-bold py-3 rounded-lg mt-2 hover:bg-botao-beje-apertado transition-colors shadow-lg active:scale-[0.98]">
                            Registrar-se
                        </button>
                        <p onClick={() => navigate('/login')} className="text-center text-xs font-medium text-cinza-texto-secundario mt-2">
                            Já Tem Conta? <span className="text-beje-principal cursor-pointer hover:underline font-bold">Faça Login</span>
                        </p>
                    </form>
                </main>
            </div>
        </>
    )
}

export default TelaRegistro