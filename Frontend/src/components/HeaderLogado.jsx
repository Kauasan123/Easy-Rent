import { useState } from 'react'
import * as Icons from '../icons/icons'
import Logo from "../assets/ImagensExtras/LogoEasy-Rent.png";
import { Link } from 'react-router-dom';

const HeaderLogado = () => {
    const usuarioNome = localStorage.getItem('usuarioNome') || 'Usuário';
    const usuarioAvatar = localStorage.getItem('usuarioAvatar');

    const [avatarErro, setAvatarErro] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <div className='pb-3 pt-3 flex flex-row items-center justify-between border-b border-preto-principal text-preto-texto-principal px-10'>
                <img className='h-20' src={Logo} alt="Logo de EasyRent" />

                <div className='flex flex-row items-center gap-10'>
                    <div className='flex flex-row gap-8 font-medium text-[1.125rem] text-preto-texto-principal'>
                        <Link to="/" className='hover:text-beje-principal transition-colors'>Home</Link>
                        <Link to="/#Sobre" className='hover:text-beje-principal transition-colors'>Sobre</Link>
                        <div className='relative'>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='flex items-center gap-0.5 hover:text-beje-principal transition-colors'>
                                Serviços <Icons.LuChevronDown size={16} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isMenuOpen && (
                                <div className='absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50'>
                                    <Link to="/#Alugar" className='block px-4 py-2 hover:bg-gray-100'>Alugar um imóvel</Link>
                                    <Link to="/#Anunciar" className='block px-4 py-2 hover:bg-gray-100'>Anunciar imóvel</Link>
                                </div>
                            )}
                        </div>
                        <Link to="#Contatos" className='hover:text-beje-principal transition-colors'>Contatos</Link>
                    </div>

                    {/* Usuário Logado */}
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-beje-principal shrink-0'>
                            {usuarioAvatar && !avatarErro ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${usuarioAvatar}`}
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
            </div>
        </>
    );
};

export default HeaderLogado;