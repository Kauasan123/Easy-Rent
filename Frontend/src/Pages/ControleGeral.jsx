import { useState } from 'react';
import * as Icons from '../icons/icons';
import Calendario from '../components/Calendario.jsx';
import Hero from '../assets/TelaPrincipal/MiniHero.jpg';

const imoveis = [
    {
        id: 1,
        titulo: "Apartamento Luxo Gramado",
        subtitulo: "Avenida Central, Gramado - RS",
        nota: "4.9",
        preco: "850",
        quartos: 3,
        vagas: 2,
        disponibilidade: "Disponível",
        imagens: [Hero, Hero, Hero],
        tipo: "Apartamento",
        banheiros: 2,
        area: 110,
        temPiscina: true,
        aceitaPet: true,
        reservas: [
            {
                periodo: "24 - 29 Maio",
                status: "Confirmada",
                cor: "text-emerald-600 bg-emerald-50",
                start: new Date(2026, 4, 24),
                end: new Date(2026, 4, 29)
            },
            {
                periodo: "02 - 05 Junho",
                status: "Pendente",
                cor: "text-amber-500 bg-amber-50",
                start: new Date(2026, 5, 2),
                end: new Date(2026, 5, 5)
            },
            {
                periodo: "07 - 10 Junho",
                status: "Cancelada",
                cor: "text-red-500 bg-red-50",
                start: new Date(2026, 5, 7),
                end: new Date(2026, 5, 10)
            }
        ]
    },
    {
        id: 2,
        titulo: "Casa de Campo Canela",
        subtitulo: "Centro, Canela - RS",
        nota: "4.8",
        preco: "950",
        quartos: 4,
        vagas: 3,
        disponibilidade: "Ocupado",
        imagens: [Hero, Hero, Hero],
        tipo: "Casa",
        banheiros: 3,
        area: 180,
        temPiscina: false,
        aceitaPet: true,
        reservas: [
            {
                periodo: "24 - 29 Maio",
                status: "Confirmada",
                cor: "text-emerald-600 bg-emerald-50",
                start: new Date(2026, 4, 24),
                end: new Date(2026, 4, 29)
            },
            {
                periodo: "20 - 29 Junho",
                status: "Confirmada",
                cor: "text-emerald-600 bg-emerald-50",
                start: new Date(2026, 5, 20),
                end: new Date(2026, 5, 29)
            }
        ]
    },
];

const atividadesRecentes = [
    { id: 1, tipo: 'nova_reserva', texto: 'Nova Reserva', imovel: 'Apartamento Gramado', periodo: '24 - 29 Maio', icon: <Icons.FaCalendarAlt size={16} /> },
    { id: 2, tipo: 'reserva_concluida', texto: 'Reserva Concluída', imovel: 'Apartamento Gramado', periodo: '10 - 15 Maio', icon: <Icons.FaCircleCheck size={16} /> }
];

const metricas = [
    { id: 1, title: 'Imóveis Ativos', value: '2', icon: <Icons.FaHouseChimney size={22} /> },
    { id: 2, title: 'Reservas Atuais', value: '3', icon: <Icons.FaCalendarAlt size={22} /> },
    { id: 3, title: 'Total de Reservas', value: '12', icon: <Icons.FaCalendarAlt size={22} /> },
    { id: 4, title: 'Avaliação Média', value: '4.8', icon: <Icons.FaStar size={22} /> },
];

function ControleGeral() {
    const [idExpandido, setIdExpandido] = useState(1);

    const toggleCard = (id) => {
        setIdExpandido(idExpandido === id ? null : id);
    };

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

            {/* Atividade Recente */}
            <div className="w-full">
                <h2 className="text-2xl font-bold text-preto-texto-principal mb-4">Atividade Recente</h2>
                <div className="bg-white border border-borda-cards rounded-2xl flex flex-col shadow-sm">
                    {atividadesRecentes.map((atividade, index) => (
                        <div key={atividade.id} className={`p-5 flex items-center gap-3 ${index !== atividadesRecentes.length - 1 ? 'border-b border-borda-cards' : ''}`}>
                            <div className="shrink-0 flex items-center justify-center text-preto-texto-principal">{atividade.icon}</div>
                            <p className="text-sm text-preto-texto-principal font-medium">
                                <span className="font-bold">{atividade.texto}</span>
                                <span className="text-cinza-texto-secundario mx-2">-</span>
                                <span className="font-semibold">{atividade.imovel}</span>
                                <span className="text-cinza-texto-secundario font-normal ml-1">({atividade.periodo})</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Seção: Status dos Imóveis */}
            <div className="w-full">
                <h2 className="text-2xl font-bold text-preto-texto-principal mb-4">Status dos Imóveis</h2>

                <div className="flex flex-col gap-4">
                    {imoveis.map((imovel) => {
                        const isAberto = idExpandido === imovel.id;

                        return (
                            <div key={imovel.id} className="bg-white border border-borda-cards rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                                <div onClick={() => toggleCard(imovel.id)} className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 select-none">
                                    <div className="flex items-center gap-4">
                                        <img src={imovel.imagens[0]} alt={imovel.titulo} className="w-16 h-12 object-cover rounded-xl border border-borda-cards" />
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-preto-texto-principal">{imovel.titulo}</h3>

                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${imovel.disponibilidade === 'Disponível' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {imovel.disponibilidade}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`text-preto-texto-principal transition-transform duration-300 ${isAberto ? 'rotate-180' : ''}`}>
                                        <Icons.LuChevronDown size={24} />
                                    </div>
                                </div>

                                {isAberto && (
                                    <div className="border-t border-borda-cards p-6 bg-white grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="flex flex-col gap-4">
                                            <h4 className="text-sm font-bold text-preto-texto-principal border-b border-borda-cards pb-2">Detalhes do Imóvel</h4>
                                            <div className="flex flex-col gap-2 text-sm font-semibold text-preto-texto-principal">
                                                <div className="flex items-center gap-2"><Icons.IoPeopleSharp size={16} className="text-gray-500" /> {imovel.tipo}</div>
                                                <div className="flex items-center gap-2"><Icons.IoIosBed size={16} className="text-gray-500" /> {imovel.quartos} Quartos</div>
                                                <div className="flex items-center gap-2"><Icons.PiBathtubFill size={16} className="text-gray-500" /> {imovel.banheiros} Banheiros</div>
                                                <div className="flex items-center gap-2"><Icons.FaCar size={16} className="text-gray-500" /> {imovel.vagas} Vagas</div>
                                            </div>
                                            <div className="mt-2">
                                                <h5 className="text-xs font-bold text-cinza-texto-secundario uppercase">Comodidades</h5>
                                                <p className="text-xs font-medium text-preto-texto-principal mt-1 leading-relaxed">
                                                    {imovel.temPiscina ? "Possui Piscina, " : ""}
                                                    {imovel.aceitaPet ? "Aceita Pets, " : ""}
                                                    Área de {imovel.area}m²
                                                </p>
                                            </div>

                                            <button className="mt-auto self-start px-4 py-2 border border-borda-cards rounded-xl font-bold text-xs text-preto-texto-principal hover:bg-cinza-fundo-x/50 transition-colors flex items-center gap-1.5 shadow-sm">
                                                <Icons.FaPencilAlt size={10} /> Editar
                                            </button>
                                        </div>

                                        <div className="border-x-0 md:border-x border-borda-cards px-0 md:px-8 flex flex-col gap-4">
                                            <h4 className="text-sm font-bold text-preto-texto-principal border-b border-borda-cards pb-2">Detalhes do Imóvel (Reservas)</h4>
                                            {imovel.reservas && imovel.reservas.length > 0 ? (
                                                <div className="flex flex-col gap-3">
                                                    {imovel.reservas.map((res, rIdx) => (
                                                        <div key={rIdx} className="flex items-center justify-between text-sm font-medium">
                                                            <span className="text-preto-texto-principal font-semibold">{res.periodo}</span>
                                                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${res.cor}`}>
                                                                {res.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-cinza-texto-secundario italic">Nenhuma reserva registrada.</p>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <h4 className="text-sm font-bold text-preto-texto-principal border-b border-borda-cards pb-2">Calendário de Disponibilidade</h4>
                                            <Calendario
                                                modoVisualizacao={true}
                                                reservas={imovel.reservas || []}
                                            />

                                            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 w-full pt-3 border-t border-borda-cards">
                                                {/* Confirmada */}
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600/20 shadow-sm"></span>
                                                    <span className="text-[11px] font-bold text-cinza-texto-secundario uppercase tracking-wide">Confirmada</span>
                                                </div>

                                                {/* Pendente */}
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-600/20 shadow-sm"></span>
                                                    <span className="text-[11px] font-bold text-cinza-texto-secundario uppercase tracking-wide">Pendente</span>
                                                </div>

                                                {/* Cancelada */}
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-600/20 shadow-sm"></span>
                                                    <span className="text-[11px] font-bold text-cinza-texto-secundario uppercase tracking-wide">Cancelada</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ControleGeral;