import { useState } from 'react'
import * as Icons from '../icons/icons'

const HeaderLogado = () => {
    const usuarioNome = localStorage.getItem('usuarioNome') || 'Usuário';
    const usuarioAvatar = localStorage.getItem('usuarioAvatar');

    const [avatarErro, setAvatarErro] = useState(false);

    return (
        <>
            <div className='pb-3 pt-3 flex flex-row items-center justify-between border-b border-preto-principal text-preto-texto-principal mx-10'>
                {/* Logo */}
                <h1 className='pl-15 text-3xl font-bold'>Logo</h1>

                <div className='flex flex-row items-center gap-11.5'>
                    {/* Navegação */}
                    <div className='flex flex-row gap-8 font-medium text-[1.125rem] text-preto-texto-principal'>
                        <a href="#">Home</a>
                        <a href="#">Sobre</a>
                        <a href="#" className='flex items-center gap-0.5'>
                            Serviços <Icons.LuChevronDown size={16} />
                        </a>
                        <a href="#">Contatos</a>
                    </div>

                    {/* Usuário Logado */}
                    <div className='flex items-center gap-3 pr-15'>
                        {/* Avatar */}
                        <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-beje-principal shrink-0'>
                            {usuarioAvatar ? (
                                <img
                                    src={`http://localhost:5000${usuarioAvatar}`}
                                    alt={usuarioNome}
                                    className='w-full h-full object-cover'
                                    onError={() => setAvatarErro(true)}
                                />
                            ) : (
                                <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                                    <Icons.FaUser size={18} className='text-gray-400' />
                                </div>
                            )}
                        </div>

                        {/* Nome e Link de Perfil */}
                        <div className='flex flex-col leading-tight'>
                            <span className='font-bold text-sm text-preto-texto-principal'>
                                {usuarioNome}
                            </span>
                            <a href="/Perfil" className='text-xs text-beje-principal font-semibold hover:underline transition-all'>
                                Ver Perfil
                            </a>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default HeaderLogado;