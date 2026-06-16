import React, { useState, useEffect } from 'react'; // Importado o useEffect
import { NavLink, useNavigate } from 'react-router-dom';
import CardsImoveis from '../components/CardsImoveis.jsx';
import ModalEditarAluguel from '../Pages/ModalEditarAluguel.jsx';
import Hero from '../assets/TelaPrincipal/MiniHero.jpg';

function MeusAlugueis() {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imovelSelecionado, setImovelSelecionado] = useState(null);

    const [imoveis, setImoveis] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregarImoveis = async () => {
        try {
            setLoading(true);
            const usuarioId = localStorage.getItem('usuarioId');

            const response = await fetch('http://localhost:5000/api/imoveis');

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
                            <div key={imovel.id || imovel._id} className="w-full max-w-[280px] 2xl:max-w-[300px]">
                                <CardsImoveis
                                    imovel={imovel}
                                    isGerenciamento={true}
                                    onEdit={handleAbrirEdicao}
                                />
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

        </div>
    );
}

export default MeusAlugueis;