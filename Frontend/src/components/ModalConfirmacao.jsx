function ModalConfirmacao({ isOpen, onClose, onConfirm, titulo, mensagem }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-preto-principal/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-preto-texto-principal mb-2">{titulo}</h3>
                <p className="text-sm text-cinza-texto-secundario mb-6">{mensagem}</p>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                    >
                        Excluir
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-white border border-preto-texto-principal text-preto-texto-principal font-bold py-2.5 rounded-xl text-sm hover:bg-botao-branco-apertado transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmacao;