import React, { useState } from 'react';
import CardsImoveis from '../components/CardsImoveis.jsx';
import ModalEditarAluguel from '../Pages/ModalEditarAluguel.jsx';
import Hero from '../assets/TelaPrincipal/MiniHero.jpg';

function MeusAlugueis() {
    // 1. Estados para controlar a visibilidade e qual imóvel editar
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imovelSelecionado, setImovelSelecionado] = useState(null);

    // 2. Função que captura o imóvel do card e ativa a modal
    const handleAbrirEdicao = (imovel) => {
        console.log("Pai recebeu o clique! Imóvel selecionado:", imovel.titulo);
        setImovelSelecionado(imovel);
        setIsModalOpen(true);
    };

    // Seu array real de imóveis
    const imoveis = [
        {
            id: 1,
            titulo: "Apartamento Luxo Gramado",
            subtitulo: "Avenida Central, Gramado - RS",
            nota: "4.9",
            preco: "850",
            quartos: 3,
            vagas: 2,
            disponibilidade: "Disponível em Agosto",
            imagens: [Hero, Hero, Hero],
            tipo: "Apartamento",
            banheiros: 2,
            area: 110,
            temPiscina: true,
            aceitaPet: true
        },
        {
            id: 2,
            titulo: "Apartamento Luxo Gramado",
            subtitulo: "Avenida Central, Gramado - RS",
            nota: "4.9",
            preco: "850",
            quartos: 3,
            vagas: 2,
            disponibilidade: "Disponível em Agosto",
            imagens: [Hero, Hero, Hero],
            tipo: "Apartamento",
            banheiros: 2,
            area: 110,
            temPiscina: true,
            aceitaPet: true
        },
    ];

    return (
        <div className="px-12 py-10 flex flex-col gap-6 w-full max-w-[1440px] mx-auto">

            {/* Título da Aba */}
            <div>
                <h1 className="text-preto-texto-principal text-3xl font-bold">Meus Alugueis</h1>
                <p className="text-cinza-texto-secundario text-sm mt-0.5">Aba para editar e verificar seus Alugueis</p>
            </div>

            {/* Grid de Cards */}
            <div className="flex flex-wrap gap-6 items-stretch justify-start mt-2">

                {/* Mapeamento dos Imóveis */}
                {imoveis.map((imovel) => (
                    <div key={imovel.id} className="w-full max-w-[280px] 2xl:max-w-[300px]">
                        <CardsImoveis
                            imovel={imovel}
                            isGerenciamento={true}
                            onEdit={handleAbrirEdicao}
                        />
                    </div>
                ))}

                {/* Card Cinza estático de Adicionar Imóvel */}
                <div className="h-[380px] 2xl:h-[420px] w-full max-w-[280px] 2xl:max-w-[300px] border border-borda-cards bg-fundo-cards rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                    <button
                        type="button"
                        className="px-5 py-2.5 bg-beje-principal hover:bg-botao-beje-apertado text-white font-bold rounded-xl flex items-center gap-2 transition-colors text-sm shadow-sm active:scale-95"
                    >
                        <span className="text-lg font-normal leading-none">&#43;</span> Adicionar Imovel
                    </button>

                    <p className="text-preto-texto-principal font-bold text-[14px] mt-4 max-w-[180px] leading-tight">
                        Adicione seu imóvel e comece a receber reservas.
                    </p>
                </div>

            </div>

            {/* RENDERIZAÇÃO DA MODAL NO FINAL DO COMPONENTE */}
            <ModalEditarAluguel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imovel={imovelSelecionado}
            />

        </div>
    );
}

export default MeusAlugueis;