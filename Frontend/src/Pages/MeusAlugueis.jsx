import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import CardsImoveis from '../components/CardsImoveis.jsx';
import ModalEditarAluguel from '../Pages/ModalEditarAluguel.jsx';
import Hero from '../assets/TelaPrincipal/MiniHero.jpg';
import * as Icons from '../icons/icons.js';
import toast from 'react-hot-toast';
import ModalConfirmacao from '../components/ModalConfirmacao.jsx';

function MeusAlugueis() {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imovelSelecionado, setImovelSelecionado] = useState(null);

    const [imoveis, setImoveis] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
    const [imovelParaExcluir, setImovelParaExcluir] = useState(null);  

    const handleExcluirImovel = (id, e) => {
        e.stopPropagation();
        setImovelParaExcluir(id);
        setModalConfirmacaoAberto(true);
    };

    const confirmarExclusao = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/imoveis/${imovelParaExcluir}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Imóvel excluído com sucesso!');
                carregarImoveis();
            } else {
                toast.error('Erro ao excluir o imóvel.');
            }
        } catch (error) {
            console.error("Erro ao excluir imóvel:", error);
            toast.error('Erro ao conectar com o servidor.');
        } finally {
            setModalConfirmacaoAberto(false);
            setImovelParaExcluir(null);
        }
    };

    const carregarImoveis = async () => {
        try {
            setLoading(true);
            const usuarioId = localStorage.getItem('usuarioId');

            const response = await fetch('${import.meta.env.VITE_API_URL}/api/imoveis');

            if (!response.ok) throw new Error('Não foi possível carregar os imóveis.');

            const dados = await response.json();

            const imoveisDoUsuario = dados.filter(
                (imovel) => imovel.usuarioId === parseInt(usuarioId)
            );

            setImoveis(imoveisDoUsuario);
        } catch (error) {
            console.error("Erro ao buscar imóveis do banco:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarImoveis();
    }, []);

    const handleAbrirEdicao = (imovel) => {
        setImovelSelecionado(imovel);
        setIsModalOpen(true);
    };

    return (
        <div className="px-12 py-10 flex flex-col gap-6 w-full mx-auto">
            {/* Título da Aba */}
            <div>
                <h1 className="text-preto-texto-principal text-3xl font-bold">Meus Alugueis</h1>
                <p className="text-cinza-texto-secundario text-sm mt-0.5">Aba para editar e verificar seus Alugueis</p>
            </div>

            {/* Grid de Cards */}
            <div className="flex flex-wrap gap-6 items-stretch justify-start mt-2">
                {loading ? (
                    <div className="w-full py-10 text-center text-cinza-texto-secundario animate-pulse">
                        Carregando seus imóveis...
                    </div>
                ) : (
                    <>
                        {imoveis.map((imovel) => (
                            <div key={imovel.id || imovel._id} className="relative group w-full max-w-[280px] 2xl:max-w-[300px]">
                                <CardsImoveis
                                    imovel={imovel}
                                    isGerenciamento={true}
                                    onEdit={handleAbrirEdicao}
                                />
                                <button
                                    type="button"
                                    onClick={(e) => handleExcluirImovel(imovel.id, e)}
                                    className="absolute top-3 right-3 bg-white hover:bg-white text-red-500 hover:text-red-600 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all z-10"
                                >
                                    <Icons.FaTrashAlt size={14} />
                                </button>
                            </div>
                        ))}
                    </>
                )}

                <div className="h-[380px] 2xl:h-[420px] w-full max-w-[280px] 2xl:max-w-[300px] border border-borda-cards bg-fundo-cards rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                    <button type="button" onClick={() => navigate('/cadastro')} className="px-5 py-2.5 bg-beje-principal hover:bg-botao-beje-apertado text-white font-bold rounded-xl flex items-center gap-2 transition-colors text-sm shadow-sm active:scale-95">
                        <span className="text-lg font-normal leading-none">&#43;</span> Adicionar Imovel
                    </button>

                    <p className="text-preto-texto-principal font-bold text-[14px] mt-4 max-w-[180px] leading-tight">
                        Adicione seu imóvel e comece a receber reservas.
                    </p>
                </div>

            </div>

            {/* Modal de Edição */}
            <ModalEditarAluguel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imovel={imovelSelecionado}
                onUpdateSuccess={carregarImoveis}
            />

            <ModalConfirmacao
                isOpen={modalConfirmacaoAberto}
                onClose={() => setModalConfirmacaoAberto(false)}
                onConfirm={confirmarExclusao}
                titulo="Excluir Imóvel"
                mensagem="Tem certeza que deseja excluir este imóvel? Essa ação não pode ser desfeita."
            />
        </div>
    );
}

export default MeusAlugueis;