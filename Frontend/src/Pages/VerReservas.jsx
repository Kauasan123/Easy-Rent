import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import HeaderLogado from '../components/HeaderLogado.jsx';
import Footer from '../components/Footer.jsx'
import * as Icons from '../icons/icons.js'

const CardReserva = ({ reserva }) => {

    const navigate = useNavigate();

    const corStatus = (status) => {
        if (status === 'Confirmada') return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
        if (status === 'Pendente') return 'bg-amber-100 text-amber-700 border border-amber-200';
        if (status === 'Cancelada') return 'bg-red-100 text-red-700 border border-red-200';
        if (status === 'Finalizado') return 'bg-gray-100 text-gray-700 border border-gray-200';
        return 'bg-gray-100 text-gray-700';
    };

    const iconStatus = (status) => {
        if (status === 'Confirmada') return <Icons.FaCircleCheck size={14} />;
        if (status === 'Pendente') return <Icons.FaCalendarAlt size={14} />;
        if (status === 'Cancelada') return <Icons.IoIosClose size={16} />;
        if (status === 'Finalizado') return <Icons.FaCircleCheck size={14} />;
    };

    const obterUrl = (imagem) => {
        const caminho = typeof imagem === 'string' ? imagem : imagem?.url;
        if (!caminho) return 'https://via.placeholder.com/300x200?text=Sem+Imagem';
        if (caminho.startsWith('http')) return caminho;
        return `${import.meta.env.VITE_API_URL}${caminho}`;
    };

    const imagemUrl = reserva.imovel?.imagens?.[0]
        ? obterUrl(reserva.imovel.imagens[0])
        : 'https://via.placeholder.com/300x200?text=Sem+Imagem';

    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const calcularDias = () => {
        if (!reserva.inicio || !reserva.fim) return 0;

        const inicio = new Date(reserva.inicio);
        const fim = new Date(reserva.fim);

        const diferenca = fim - inicio;
        const dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

        return dias > 0 ? dias : 0;
    };

    const calcularTotal = () => {
        const dias = calcularDias();
        const preco = parseFloat(reserva.imovel?.preco) || 0;

        return dias * preco;
    };

    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

    <span className="text-2xl font-black text-preto-texto-principal">
        R${parseFloat(calcularTotal()).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
    </span>

    const localizacao = [reserva.imovel?.bairro, reserva.imovel?.cidade].filter(Boolean).join(', ');

    return (
        <div className="flex items-center gap-6 p-6 border-b border-borda-cards">
            {/* Imagem */}
            <img
                src={imagemUrl}
                alt={reserva.imovel?.titulo}
                className="w-32 h-24 object-cover rounded-xl shrink-0"
            />

            {/* Informações */}
            <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-xl font-bold text-preto-texto-principal">{reserva.imovel?.titulo}</h3>
                <div className="flex items-center gap-1 text-cinza-texto-secundario text-sm">
                    <Icons.FaLocationDot size={12} />
                    <span>{localizacao}</span>
                </div>

                <div className="flex items-center gap-8 mt-2">
                    {/* Check-in */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-preto-texto-principal uppercase">Check-in</span>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-preto-texto-principal">
                            <Icons.FaCalendarAlt size={13} className="text-beje-principal" />
                            {formatarData(reserva.inicio)}
                        </div>
                    </div>

                    <div className="w-px h-8 bg-borda-cards" />

                    {/* Check-out */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-preto-texto-principal uppercase">Check-out</span>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-preto-texto-principal">
                            <Icons.FaCalendarAlt size={13} className="text-beje-principal" />
                            {formatarData(reserva.fim)}
                        </div>
                    </div>

                    <div className="w-px h-8 bg-borda-cards" />

                    {/* Hóspedes */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-preto-texto-principal uppercase">Hóspedes</span>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-preto-texto-principal">
                            <Icons.IoPeopleSharp size={15} className="text-beje-principal" />
                            {reserva.hospedes || 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status e Total */}
            <div className="flex flex-col items-end gap-3 shrink-0">
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${corStatus(reserva.status)}`}>
                    {iconStatus(reserva.status)}
                    {reserva.status}
                </span>

                <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-cinza-texto-secundario">Total Pago</span>
                    <span className="text-2xl font-black text-preto-texto-principal">
                        R${calcularTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </div>

                <button type="button" onClick={() => navigate(`/detalhesReserva/${reserva.id}`)} className="px-4 py-2 border border-beje-principal text-beje-principal text-sm font-bold rounded-xl hover:bg-beje-principal hover:text-white transition-all" >
                    Ver Detalhes
                </button>
            </div>
        </div>
    );
};

function VerReservas() {

    const navigate = useNavigate();

    const [abaAtiva, setAbaAtiva] = useState('atuais');
    const [reservas, setReservas] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const usuarioId = sessionStorage.getItem('usuarioId');

    useEffect(() => {
        const carregarReservas = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/reservas/usuario/${usuarioId}`
                );

                const data = await response.json();

                setReservas(data);
            } catch (error) {
                console.error("Erro ao carregar reservas:", error);
            } finally {
                setCarregando(false);
            }
        };

        if (usuarioId) carregarReservas();
    }, [usuarioId]);

    const reservasAtuais = reservas.filter(r =>
        r.status === 'Pendente' ||
        r.status === 'Confirmada'
    );

    const reservasHistorico = reservas.filter(r =>
        r.status === 'Cancelada' ||
        r.status === 'Finalizado'
    );

    const reservasExibidas = abaAtiva === 'atuais' ? reservasAtuais : reservasHistorico;

    return (
        <>
            <header>
                <HeaderLogado />
            </header>

            <main className="min-h-screen bg-white px-12 py-10 max-w-[1200px] mx-auto">
                <h1 className="text-3xl font-bold text-preto-texto-principal mb-8">Minhas Reservas</h1>

                {/* Card principal */}
                <div className="border border-borda-cards rounded-2xl overflow-hidden shadow-sm">

                    {/* Abas */}
                    <div className="flex border-b border-borda-cards">
                        <button onClick={() => setAbaAtiva('atuais')} className={`flex items-center gap-2 px-8 py-4 text-sm font-bold transition-all border-b-2 ${abaAtiva === 'atuais'
                            ? 'border-beje-principal text-beje-principal'
                            : 'border-transparent text-cinza-texto-secundario hover:text-preto-texto-principal'}`}>
                            <Icons.FaCalendarAlt size={16} />
                            Reservas Atuais
                        </button>
                        <button onClick={() => setAbaAtiva('historico')} className={`flex items-center gap-2 px-8 py-4 text-sm font-bold transition-all border-b-2 ${abaAtiva === 'historico'
                            ? 'border-beje-principal text-beje-principal'
                            : 'border-transparent text-cinza-texto-secundario hover:text-preto-texto-principal'}`}>
                            <Icons.FaCalendarAlt size={16} />
                            Histórico
                        </button>
                    </div>

                    {/* Lista de reservas */}
                    <div className="overflow-y-auto" style={{ height: '579px' }}>
                        {reservasExibidas.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center gap-3">
                                <Icons.FaCalendarAlt size={40} className="text-gray-300" />
                                <p className="text-cinza-texto-secundario font-semibold">Nenhuma reserva encontrada.</p>
                            </div>
                        ) : (
                            reservasExibidas.map(reserva => (
                                <CardReserva key={reserva.id} reserva={reserva} />
                            ))
                        )}
                    </div>
                </div>

                {/* Botão voltar */}
                <div className="flex justify-center mt-10">
                    <Link to="/principal" className="px-10 py-3.5 bg-beje-principal hover:bg-botao-beje-apertado text-white font-bold rounded-xl transition-all active:scale-95 shadow-sm" >
                        Voltar a tela Inicial
                    </Link>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </>
    );
}

export default VerReservas;