import { useState } from 'react'
import * as Icons from '../icons/icons'

function Footer() {
    return (
        <>
            <footer className="w-full bg-white border-t border-preto-principal font-sans">
                <div className="max-w-1200 mx-auto py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-4xl font-bold text-black">
                        Logo
                    </div>
                    <div className="flex flex-col gap-y-4 mr-40">
                        <div className="flex items-center gap-3">
                            <Icons.FaLocationDot className="text-black" size={24} />
                            <span className="text-sm text-gray-700">
                                Rua XV de Novembro, 732 — Centro, Pelotas - RS, 96015-000
                            </span>
                        </div>
                        <div className='flex gap-4'>
                            <div className="flex items-center gap-3">
                                <Icons.MdOutlineMailOutline className="text-black" size={24} />
                                <span className="text-sm text-gray-700">EasyRent@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Icons.FaPhone className="text-black" size={24} />
                                <span className="text-sm text-gray-700">(123) 456-7890</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-6">
                    <div className="max-w-1200 mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <nav className="flex flex-wrap justify-center gap-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            <a href="#" className="hover:text-black transition-colors">Sobre Nós</a>
                            <a href="#" className="hover:text-black transition-colors">Contatos</a>
                            <a href="#" className="hover:text-black transition-colors">Ajuda</a>
                            <a href="#" className="hover:text-black transition-colors">Política de Privacidade</a>
                            <a href="#" className="hover:text-black transition-colors">Disclaimer</a>
                        </nav>
                        <div className="text-[11px] text-gray-400 font-medium">
                            Copyright © 2018 • Easy Rent
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;