import * as Icons from '../icons/icons';
import Calendario from '../components/Calendario.jsx';

function StatusImovelCard({ imovel, isAberto, onToggle }) {

    const formatarPeriodo = (inicio, fim) => {
        const dataInicio = new Date(inicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        const dataFim = new Date(fim).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        return `${dataInicio} - ${dataFim}`;
    };

    const corStatus = (status) => {
        if (status === 'Confirmada') return 'text-emerald-600 bg-emerald-50';
        if (status === 'Pendente') return 'text-amber-500 bg-amber-50';
        if (status === 'Cancelada') return 'text-red-500 bg-red-50';
        return 'text-gray-500 bg-gray-50';
    };

    const temReservaAtiva = imovel.reservas?.some(
        r => r.status === 'Confirmada' || r.status === 'Pendente'
    );

    const reservasParaCalendario = (imovel.reservas || []).map(r => ({
        start: new Date(r.inicio),
        end: new Date(r.fim),
        status: r.status
    }));

    const urlImagem = imovel.imagens?.[0]?.url
        ? imovel.imagens[0].url.startsWith('http')
            ? imovel.imagens[0].url
            : `http://localhost:5000${imovel.imagens[0].url}`
        : null;

    return (
        <div className="bg-white border border-borda-cards rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
            {/* Header */}
            <div onClick={onToggle} className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 select-none">
                <div className="flex items-center gap-4">
                    {urlImagem ? (
                        <img src={urlImagem} alt={imovel.titulo} className="w-16 h-12 object-cover rounded-xl border border-borda-cards" />
                    ) : (
                        <div className="w-16 h-12 rounded-xl border border-borda-cards bg-gray-100 flex items-center justify-center">
                            <Icons.FaHouseChimney size={20} className="text-gray-400" />
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-preto-texto-principal">{imovel.titulo}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${temReservaAtiva ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {temReservaAtiva ? 'Ocupado' : 'Disponível'}
                        </span>
                    </div>
                </div>
                <div className={`text-preto-texto-principal transition-transform duration-300 ${isAberto ? 'rotate-180' : ''}`}>
                    <Icons.LuChevronDown size={24} />
                </div>
            </div>

            {/* Conteúdo expandido */}
            {isAberto && (
                <div className="border-t border-borda-cards p-6 bg-white grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Detalhes */}
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
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
                                {imovel.hasWifi && <span className="text-xs font-medium text-preto-texto-principal">• Wi-Fi</span>}
                                {imovel.hasArCondicionado && <span className="text-xs font-medium text-preto-texto-principal">• Ar-Condicionado</span>}
                                {imovel.hasEstacionamento && <span className="text-xs font-medium text-preto-texto-principal">• Estacionamento</span>}
                                {imovel.hasPiscina && <span className="text-xs font-medium text-preto-texto-principal">• Piscina</span>}
                                {imovel.hasTv && <span className="text-xs font-medium text-preto-texto-principal">• TV</span>}
                                {imovel.hasMaquinaLavar && <span className="text-xs font-medium text-preto-texto-principal">• Máquina de Lavar</span>}
                                {imovel.hasChurrascaria && <span className="text-xs font-medium text-preto-texto-principal">• Churrascaria</span>}
                                {imovel.hasElevador && <span className="text-xs font-medium text-preto-texto-principal">• Elevador</span>}
                                {imovel.hasPortaria24h && <span className="text-xs font-medium text-preto-texto-principal">• Portaria 24h</span>}
                                {imovel.aceitaPets && <span className="text-xs font-medium text-preto-texto-principal">• Aceita Pets</span>}
                                {imovel.permiteFestas && <span className="text-xs font-medium text-preto-texto-principal">• Permite Festas</span>}
                                {imovel.acessibilidade && <span className="text-xs font-medium text-preto-texto-principal">• Acessibilidade</span>}
                                {imovel.naoFumante && <span className="text-xs font-medium text-preto-texto-principal">• Não Fumante</span>}
                                {!imovel.hasWifi && !imovel.hasArCondicionado && !imovel.hasEstacionamento &&
                                    !imovel.hasPiscina && !imovel.hasTv && !imovel.hasMaquinaLavar &&
                                    !imovel.hasChurrascaria && !imovel.hasElevador && !imovel.hasPortaria24h &&
                                    !imovel.aceitaPets && !imovel.permiteFestas && !imovel.acessibilidade && !imovel.naoFumante &&
                                    <span className="text-xs font-medium text-cinza-texto-secundario italic">Nenhuma comodidade cadastrada.</span>
                                }
                            </div>
                        </div>
                        <button className="mt-auto self-start px-4 py-2 border border-borda-cards rounded-xl font-bold text-xs text-preto-texto-principal hover:bg-cinza-fundo-x/50 transition-colors flex items-center gap-1.5 shadow-sm">
                            <Icons.FaPencilAlt size={10} /> Editar
                        </button>
                    </div>

                    {/* Reservas */}
                    <div className="border-x-0 md:border-x border-borda-cards px-0 md:px-8 flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-preto-texto-principal border-b border-borda-cards pb-2">Reservas</h4>
                        {imovel.reservas && imovel.reservas.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {imovel.reservas.map((res) => (
                                    <div key={res.id} className="flex items-center justify-between text-sm font-medium">
                                        <span className="text-preto-texto-principal font-semibold">
                                            {formatarPeriodo(res.inicio, res.fim)}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${corStatus(res.status)}`}>
                                            {res.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-cinza-texto-secundario italic">Nenhuma reserva registrada.</p>
                        )}
                    </div>

                    {/* Calendário */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-preto-texto-principal border-b border-borda-cards pb-2">Calendário de Disponibilidade</h4>
                        <Calendario
                            modoVisualizacao={true}
                            reservas={reservasParaCalendario}
                        />
                        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 w-full pt-3 border-t border-borda-cards">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600/20 shadow-sm"></span>
                                <span className="text-[11px] font-bold text-cinza-texto-secundario uppercase tracking-wide">Confirmada</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-600/20 shadow-sm"></span>
                                <span className="text-[11px] font-bold text-cinza-texto-secundario uppercase tracking-wide">Pendente</span>
                            </div>
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
}

export default StatusImovelCard;