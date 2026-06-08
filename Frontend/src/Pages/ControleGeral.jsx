import { useState, useEffect } from 'react';
import * as Icons from '../icons/icons';
import Calendario from '../components/Calendario.jsx';
import StatusImovelCard from '../components/StatusImovelCard.jsx';
import Hero from '../assets/TelaPrincipal/MiniHero.jpg';

function ControleGeral() {
    const [imoveis, setImoveis] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [idExpandido, setIdExpandido] = useState(null);

    const usuarioId = localStorage.getItem('usuarioId');

    useEffect(() => {
        const carregarImoveis = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/imoveis`);
                const data = await response.json();

                const imoveisDoUsuario = data.filter(
                    (imovel) => imovel.usuarioId === parseInt(usuarioId)
                );

                const imoveisComReservas = await Promise.all(
                    imoveisDoUsuario.map(async (imovel) => {
                        try {
                            const resReservas = await fetch(
                                `http://localhost:5000/api/reservas/imovel/${imovel.id}`
                            );
                            const reservas = resReservas.ok ? await resReservas.json() : [];
                            return { ...imovel, reservas };
                        } catch {
                            return { ...imovel, reservas: [] };
                        }
                    })
                );

                setImoveis(imoveisComReservas);
            } catch (error) {
                console.error("Erro ao carregar imóveis:", error);
            } finally {
                setCarregando(false);
            }
        };

        if (usuarioId) carregarImoveis();
    }, [usuarioId]);

    const toggleCard = (id) => {
        setIdExpandido(idExpandido === id ? null : id);
    };

    const totalReservas = imoveis.reduce((acc, im) => acc + (im.reservas?.length || 0), 0);
    const reservasAtuais = imoveis.reduce((acc, im) => {
        return acc + (im.reservas?.filter(r => r.status === 'Confirmada' || r.status === 'Pendente').length || 0);
    }, 0);
    const avaliacaoMedia = '—';

    const metricas = [
        { id: 1, title: 'Imóveis Ativos', value: imoveis.length.toString(), icon: <Icons.FaHouseChimney size={22} /> },
        { id: 2, title: 'Reservas Atuais', value: reservasAtuais.toString(), icon: <Icons.FaCalendarAlt size={22} /> },
        { id: 3, title: 'Total de Reservas', value: totalReservas.toString(), icon: <Icons.FaCalendarAlt size={22} /> },
        { id: 4, title: 'Avaliação Média', value: avaliacaoMedia, icon: <Icons.FaStar size={22} /> },
    ];

    if (carregando) {
        return (
            <div className="px-12 py-10 flex items-center justify-center h-64">
                <p className="text-cinza-texto-secundario font-semibold">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="px-12 py-10 flex flex-col gap-10">
            <div>
                <h1 className='text-preto-texto-principal text-3xl font-bold'>Controle Geral</h1>
                <p className='text-cinza-texto-secundario'>Aba para Controlar e Verificar seus Alugueis</p>
            </div>

            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {metricas.map((item) => (
                    <div key={item.id} className="bg-white border border-borda-cards rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-cinza-fundo-x flex items-center justify-center shrink-0">
                            {item.icon}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-cinza-texto-secundario uppercase tracking-wide">{item.title}</span>
                            <span className="text-2xl font-black text-preto-texto-principal mt-0.5">{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Seção: Status dos Imóveis */}
            <div className="w-full">
                <h2 className="text-2xl font-bold text-preto-texto-principal mb-4">Status dos Imóveis</h2>

                {imoveis.length === 0 ? (
                    <div className="bg-white border border-borda-cards rounded-2xl p-8 text-center">
                        <p className="text-cinza-texto-secundario font-semibold">Nenhum imóvel cadastrado ainda.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {imoveis.map((imovel) => (
                            <StatusImovelCard
                                key={imovel.id}
                                imovel={imovel}
                                isAberto={idExpandido === imovel.id}
                                onToggle={() => toggleCard(imovel.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ControleGeral;