import { useState } from 'react'
import * as Icons from '../icons/icons'

function Perfil() {
    return (
        <div className="px-12 py-10 flex flex-col gap-10">
            
            {/* Header da Página */}
            <div>
                <h1 className='text-preto-texto-principal text-3xl font-bold'>Perfil</h1>
                <p className='text-cinza-texto-secundario'>Aba para Editar seu Perfil</p>
            </div>

            {/* Informações Pessoais */}
            <section className="flex flex-col gap-4">
                <div className='border border-borda-cards bg-fundo-cards rounded-3xl overflow-hidden shadow-sm'>
                    <div className="p-6 pb-2">
                        <h2 className='text-2xl font-bold text-preto-texto-principal'>Informações Pessoais</h2>
                    </div>
                    
                    <div className="p-8 pt-4 flex flex-col md:flex-row gap-12 items-start">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-40 h-40 rounded-full bg-cinza-claro border-2 border-borda-cards flex items-center justify-center overflow-hidden relative group cursor-pointer">
                                <Icons.FaImage size={40} className="text-cinza-texto-secundario opacity-40 group-hover:scale-110 transition-transform" />
                            </div>
                            <button className="text-beje-principal font-bold text-sm underline-offset-4 hover:underline">
                                Alterar Foto
                            </button>
                        </div>

                        <div className="flex-1 w-full flex flex-col gap-5">
                            <div className="flex flex-col gap-1">
                                <label className="text-preto-texto-principal font-semibold text-sm">Nome</label>
                                <div className="flex gap-3">
                                    <input type="text" defaultValue="Camila Duarte" className="flex-1 bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal/50 outline-none focus:border-beje-principal transition-colors" />
                                    <button className="flex items-center gap-2 px-4 py-2 border border-beje-principal rounded-xl text-beje-principal text-xs font-bold hover:text-branco-texto-principal hover:bg-beje-principal transition-all">
                                        <Icons.FaPencilAlt size={12} /> Editar
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-preto-texto-principal font-semibold text-sm">E-mail</label>
                                <div className="flex gap-3">
                                    <input type="email" defaultValue="CamilaDuarte@gmail.com" className="flex-1 bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal/50 outline-none focus:border-beje-principal transition-colors" />
                                    <button className="flex items-center gap-2 px-4 py-2 border border-beje-principal rounded-xl text-beje-principal text-xs font-bold hover:text-branco-texto-principal hover:bg-beje-principal transition-all">
                                        <Icons.FaPencilAlt size={12} /> Editar
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-preto-texto-principal font-semibold text-sm">Telefone</label>
                                <div className="flex gap-3">
                                    <input type="text" defaultValue="(53) 99999-9999" className="flex-1 bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal/50 outline-none focus:border-beje-principal transition-colors" />
                                    <button className="flex items-center gap-2 px-4 py-2 border border-beje-principal rounded-xl text-beje-principal text-xs font-bold hover:text-branco-texto-principal hover:bg-beje-principal transition-all">
                                        <Icons.FaPencilAlt size={12} /> Editar
                                    </button>
                                </div>
                            </div>

                            <button className="mt-4 bg-beje-principal hover:bg-botao-beje-apertado text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-md">
                                <Icons.FaSave size={18} /> Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Segurança */}
            <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-preto-texto-principal">Segurança</h2>
                <div className="border border-borda-cards bg-fundo-cards rounded-3xl p-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cinza-claro/50 rounded-full flex items-center justify-center text-cinza-texto-secundario">
                            <Icons.IoIosUnlock size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-preto-texto-principal">
                                Senha: <span className="text-lg">**********</span>
                            </p>
                            <p className="text-xs text-cinza-texto-secundario">
                                Altere sua senha regularmente para manter sua conta segura.
                            </p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 border border-beje-principal rounded-xl text-beje-principal text-sm font-bold hover:text-branco-texto-principal hover:bg-beje-principal transition-all">
                        <Icons.FaPencilAlt size={14} /> Editar
                    </button>
                </div>
            </section>

            {/* Espaço da Conta */}
            <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-preto-texto-principal">Espaço da Conta</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-borda-cards bg-fundo-cards rounded-3xl p-6 flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors shadow-sm">
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
    );
}

export default Perfil;