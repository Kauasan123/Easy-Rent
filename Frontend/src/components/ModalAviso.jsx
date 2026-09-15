import React from 'react'
import * as Icons from '../icons/icons.js'

function ModalAviso({
    tipo,
    onConfirmar,
    onCancelar

}) {

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
            {tipo === 'confirmacao' && (
                <div className="w-[400px] min-h-[250px] bg-white rounded-xl px-6 py-5 flex flex-col items-center justify-center">
                    <Icons.IoIosClose size={60} className="text-red-500"/>

                    <h2 className="text-red-500 text-2xl font-bold">
                        Tem Certeza?
                    </h2>

                    <p className="text-base text-center text-preto-texto-principal mt-2">
                        Tem certeza que deseja Cancelar
                        <br />
                        sua reserva?
                    </p>

                    <div className="flex items-center gap-3 mt-5">
                        <button type="button" onClick={onConfirmar} className="bg-beje-principal hover:bg-botao-beje-apertado text-white text-sm font-semibold px-6 py-2 rounded-md transition-colors">
                            Sim
                        </button>

                        <button type="button" onClick={onCancelar} className="bg-white hover:bg-gray-100 text-preto-texto-principal text-sm font-semibold px-6 py-2 rounded-md border border-gray-400 transition-colors">
                            Não
                        </button>
                    </div>
                </div>
            )}

            {tipo === 'carregando' && (
                <div className="w-[400px] min-h-[250px] bg-white rounded-xl flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-2 border-black border-t-transparent rounded-full animate-spin mb-3" />
                    <span className="text-base font-medium text-preto-texto-principal">
                        Carregando
                    </span>
                </div>
            )}

            {tipo === 'sucesso' && (
                <div className="w-[400px] min-h-[250px] bg-white rounded-xl px-6 py-5 flex flex-col items-center justify-center">
                    <Icons.FaCircleCheck size={60} className="text-green-600"/>
                    <h2 className="text-green-600 text-2xl font-bold">
                        Confirmado
                    </h2>

                    <p className="text-base text-center text-preto-texto-principal mt-2">
                        Reserva cancelada com sucesso
                    </p>
                </div>
            )}
        </div>

    )

}

export default ModalAviso