import { useState } from 'react'
import * as Icons from '../icons/icons'

function Header() {
    return (
        <>
            <div className='pb-3 pt-3 flex flex-row items-center justify-between border-b border-preto-principal text-preto-texto-principal mx-10'>
                {/* Substituir pela Logo */}
                <h1 className='pl-15 text-3xl font-bold'>Logo</h1>
                <div className='flex flex-row items-center gap-11.5'>
                    <div className='flex flex-row gap-8 font-medium text-[1.125rem] text-preto-texto-principal '>
                        <a href="#" className=''>Home</a>
                        <a href="#" className=''>Sobre</a>
                        <a href="#" className='flex items-center gap-0.5'>
                            Serviços <Icons.LuChevronDown size={16} />
                        </a>
                        <a href="#" className=''>Contatos</a>
                    </div>
                    <div className='flex items-center gap-5 font-medium text-[1.125rem] pr-15'>
                        <a href="/login" className='hover:bg-botao-branco-apertado text-preto-texto-principal border rounded-[0.313rem] py-1.5 pl-5 pr-5 cursor-pointer active:scale-95 transition-all '>
                            Login
                        </a>
                        <a href="/registro" className='border-preto-principal text-branco-texto-principal bg-beje-principal hover:bg-botao-beje-apertado border rounded-[0.313rem] py-1.5 pl-5 pr-5 cursor-pointer active:scale-95 transition-all '>
                            Registrar
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;