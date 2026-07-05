import { useState } from 'react'
import * as Icons from '../icons/icons'
import Logo from '../assets/ImagensExtras/LogoEasy-rent.png'
import { Link } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <div className='pb-3 pt-3 flex flex-row items-center justify-between border-b border-preto-principal text-preto-texto-principal px-10'>
                <img className='h-20' src={Logo} alt="Logo de EasyRent" />

                <div className='flex flex-row items-center gap-8'>
                    <div className='flex flex-row gap-8 font-medium text-[1.125rem] text-preto-texto-principal'>
                        <Link to="/" className='hover:text-beje-principal transition-colors'>Home</Link>
                        <Link to="#Sobre" className='hover:text-beje-principal transition-colors'>Sobre</Link>
                        <div className='relative'>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='flex items-center gap-0.5 hover:text-beje-principal transition-colors'>
                                Serviços <Icons.LuChevronDown size={16} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isMenuOpen && (
                                <div className='absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50'>
                                    <Link to="#Alugar" className='block px-4 py-2 hover:bg-gray-100'>Alugar um imóvel</Link>
                                    <Link to="#Anunciar" className='block px-4 py-2 hover:bg-gray-100'>Anunciar imóvel</Link>
                                </div>
                            )}
                        </div>
                        <Link to="#Contatos" className='hover:text-beje-principal transition-colors'>Contatos</Link>
                    </div>

                    <div className='flex items-center gap-5 font-medium text-[1.125rem]'>
                        <a href="/login" className='hover:bg-botao-branco-apertado text-preto-texto-principal border border-preto-principal rounded-[0.313rem] py-1.5 px-5 cursor-pointer active:scale-95 transition-all'>
                            Login
                        </a>
                        <a href="/registro" className='border border-beje-principal text-branco-texto-principal bg-beje-principal hover:bg-botao-beje-apertado rounded-[0.313rem] py-1.5 px-5 cursor-pointer active:scale-95 transition-all'>
                            Registrar
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;