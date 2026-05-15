import { useState } from 'react'
import * as Icons from '../icons/icons'
import Sidebar from '../components/SideBar'

function ControleGeral() {
    return (
        <>
            <div className="px-12 py-10 flex flex-col gap-10">
                <div>
                    <h1 className='text-preto-texto-principal text-3xl font-bold'>Controle Geral</h1>
                    <p className='text-cinza-texto-secundario'>Aba para Controlar e Verificar seus Alugueis</p>
                </div>

            </div>
        </>
    )
}

export default ControleGeral