import { useEffect, useState } from 'react';
import * as Icons from '../icons/icons';

function CardReserva({ reserva, imovel }) {

    const statusConfig = {
        Pendente: {
            className: 'bg-amber-100 text-amber-700',
            icon: <Icons.FaCalendarAlt size={13} />,
            label: 'Pendente',
        },

        Confirmada: {
            className: 'bg-sky-100 text-sky-700',
            icon: <Icons.FaCalendarAlt size={13} />,
            label: 'Confirmada',
        },

        Finalizado: {
            className: 'bg-green-100 text-green-700',
            icon: <Icons.FaCircleCheck size={13} />,
            label: 'Finalizado',
        },

        Cancelada: {
            className: 'bg-rose-100 text-rose-700',
            icon: null,
            label: 'Cancelada',
        },

    };

    const status = statusConfig[reserva.status] || {
        className: 'bg-gray-100 text-gray-600',
        icon: null,
        label: reserva.status,
    };

    const inicio = new Date(reserva.inicio);
    const fim = new Date(reserva.fim);

    const diferencaTempo = fim.getTime() - inicio.getTime();
    const noites = Math.max(
        1,
        Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24))
    );

    const valorNoite = Number(imovel?.preco || 0);
    const subtotal = valorNoite * noites;
    const taxa = subtotal * 0.05;
    const total = subtotal + taxa;

    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatarValor = (valor) => {
        return valor.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    return (

        <div className="bg-white rounded-2xl border border-borda-cards shadow-sm p-5">
            <div className="grid grid-cols-5 gap-6 items-center">
                {/* Hóspede */}
                <div className="flex items-center gap-3 min-w-0">
                    {reserva.hospede?.avatarPath ? (
                        <img src={reserva.hospede.avatarPath} alt={reserva.hospede.nome} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />

                    ) : (

                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Icons.IoPeopleSharp size={20} className="text-gray-500" />
                        </div>
                    )}

                    <div className="min-w-0">
                        <h4 className="font-bold text-preto-texto-principal text-sm truncate">
                            {reserva.hospede?.nome || 'Hóspede'}
                        </h4>

                        <div className="flex items-center gap-1 text-xs text-cinza-texto-secundario mt-1">
                            <Icons.FaHouseChimney size={11} />

                            <span className="truncate">
                                {imovel?.titulo || 'Imóvel'}
                            </span>
                        </div>

                        <span className="block text-xs text-cinza-texto-secundario truncate">
                            {imovel?.bairro
                                ? `${imovel.bairro}, ${imovel.cidade}`
                                : imovel?.cidade || ''
                            }
                        </span>
                    </div>
                </div>

                {/* Estadia */}
                <div className="flex flex-col gap-2 text-xs">
                    <div className="flex flex-col">
                        <span className="font-semibold text-preto-texto-principal">
                            Check-in
                        </span>

                        <div className="flex items-center gap-1 text-cinza-texto-secundario">
                            <Icons.FaCalendarAlt size={11} />

                            <span>
                                {formatarData(reserva.inicio)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-semibold text-preto-texto-principal">
                            Check-out
                        </span>

                        <div className="flex items-center gap-1 text-cinza-texto-secundario">
                            <Icons.FaCalendarAlt size={11} />

                            <span>
                                {formatarData(reserva.fim)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Valor */}
                <div className="flex flex-col text-xs gap-1">
                    <div className="flex justify-between gap-4">
                        <span className="text-cinza-texto-secundario">
                            R${formatarValor(valorNoite)} x {noites} noites
                        </span>

                        <span className="font-medium text-preto-texto-principal">
                            R${formatarValor(subtotal)}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-cinza-texto-secundario">
                            Taxa de Serviço 5%
                        </span>

                        <span className="font-medium text-preto-texto-principal">
                            R${formatarValor(taxa)}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4 font-bold text-preto-texto-principal mt-1 pt-1 border-t border-borda-cards">
                        <span>Total Pago</span>
                        <span className="underline">
                            R${formatarValor(total)}
                        </span>
                    </div>
                </div>

                {/* Hóspedes */}
                <div className="flex items-center gap-2 text-xs font-semibold text-preto-texto-principal">
                    <Icons.IoPeopleSharp size={17} />
                    <span>
                        {reserva.hospedes}{' '}
                        {reserva.hospedes === 1 ? 'Hóspede' : 'Hóspedes'}
                    </span>
                </div>

                {/* Status */}
                <div className="flex flex-col items-start gap-2">
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.className}`}>
                        {status.icon}
                        {status.label}
                    </span>
                    <span className="text-[11px] text-cinza-texto-secundario">
                        Código: {reserva.codigo}
                    </span>
                </div>
            </div>
        </div>
    );
}

function ControleUnico() {
    const [imoveis, setImoveis] = useState([]);
    const [imovelSelecionado, setImovelSelecionado] = useState('');
    const [reservas, setReservas] = useState([]);
    const [filtro, setFiltro] = useState('Todos');
    const [carregandoImoveis, setCarregandoImoveis] = useState(true);
    const [carregandoReservas, setCarregandoReservas] = useState(false);
    const usuarioId = sessionStorage.getItem('usuarioId');
    const [paginaAtual, setPaginaAtual] = useState(1);

    const itensPorPagina = 5;

    useEffect(() => {
        const carregarImoveis = async () => {

            try {

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/imoveis`
                );

                if (!response.ok) {
                    throw new Error('Erro ao buscar imóveis.');
                }

                const data = await response.json();

                const imoveisDoUsuario = data.filter(
                    (imovel) =>
                        imovel.usuarioId === parseInt(usuarioId)
                );

                setImoveis(imoveisDoUsuario);

                if (imoveisDoUsuario.length > 0) {
                    setImovelSelecionado(imoveisDoUsuario[0].id);
                }

            } catch (error) {

                console.error(
                    'Erro ao carregar imóveis:',
                    error
                );

            } finally {

                setCarregandoImoveis(false);

            }
        };

        if (usuarioId) {
            carregarImoveis();
        } else {
            setCarregandoImoveis(false);
        }

    }, [usuarioId]);

    useEffect(() => {

        const carregarReservas = async () => {

            if (!imovelSelecionado) {
                setReservas([]);
                return;
            }

            try {

                setCarregandoReservas(true);

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/reservas/imovel/${imovelSelecionado}`
                );

                if (!response.ok) {
                    throw new Error('Erro ao buscar reservas.');
                }

                const data = await response.json();

                setReservas(data);

            } catch (error) {

                console.error(
                    'Erro ao carregar reservas:',
                    error
                );

                setReservas([]);

            } finally {

                setCarregandoReservas(false);

            }
        };

        carregarReservas();

    }, [imovelSelecionado]);

    const imovelAtual = imoveis.find(
        (imovel) =>
            imovel.id === Number(imovelSelecionado)
    );

    const totalReservas = reservas.length;

    const reservasAtuais = reservas.filter(
        (reserva) =>
            reserva.status === 'Confirmada' ||
            reserva.status === 'Pendente'
    ).length;

    const avaliacaoMedia = '—';

    const metricas = [

        {
            id: 1,
            title: 'Imóveis Ativos',
            value: imoveis.length.toString(),
            icon: <Icons.FaHouseChimney size={22} />,
        },

        {
            id: 2,
            title: 'Reservas Atuais',
            value: reservasAtuais.toString(),
            icon: <Icons.FaCalendarAlt size={22} />,
        },

        {
            id: 3,
            title: 'Total de Reservas',
            value: totalReservas.toString(),
            icon: <Icons.FaCalendarAlt size={22} />,
        },

        {
            id: 4,
            title: 'Avaliação Média',
            value: avaliacaoMedia,
            icon: <Icons.FaStar size={22} />,
        },

    ];

    const reservasFiltradas = reservas.filter((reserva) => {

        if (filtro === 'Todos') {
            return true;
        }

        if (filtro === 'Próximas') {
            return (
                reserva.status === 'Confirmada' ||
                reserva.status === 'Pendente'
            );
        }

        if (filtro === 'Em Andamento') {
            return reserva.status === 'Confirmada';
        }

        if (filtro === 'Finalizadas') {
            return reserva.status === 'Finalizado';
        }

        if (filtro === 'Canceladas') {
            return reserva.status === 'Cancelada';
        }

        return true;

    });

    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const reservasExibidas = reservasFiltradas.slice(
        indicePrimeiroItem,
        indiceUltimoItem
    );

    const totalPaginas = Math.ceil(
        reservasFiltradas.length / itensPorPagina
    );

    const quantidadeFiltro = (nomeFiltro) => {

        if (nomeFiltro === 'Todos') {
            return reservas.length;
        }

        if (nomeFiltro === 'Próximas') {
            return reservas.filter(
                (r) =>
                    r.status === 'Confirmada' ||
                    r.status === 'Pendente'
            ).length;
        }

        if (nomeFiltro === 'Em Andamento') {
            return reservas.filter(
                (r) =>
                    r.status === 'Confirmada'
            ).length;
        }

        if (nomeFiltro === 'Finalizadas') {
            return reservas.filter(
                (r) =>
                    r.status === 'Finalizado'
            ).length;
        }

        if (nomeFiltro === 'Canceladas') {
            return reservas.filter(
                (r) =>
                    r.status === 'Cancelada'
            ).length;
        }

        return 0;
    };

    if (carregandoImoveis) {

        return (

            <div className="px-12 py-10 flex items-center justify-center h-64">
                <p className="text-cinza-texto-secundario font-semibold">
                    Carregando imóveis...
                </p>
            </div>
        );
    }

    return (

        <div className="px-12 py-10 flex flex-col gap-10">
            {/* Cabeçalho */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-preto-texto-principal text-3xl font-bold">
                        Controle Único
                    </h1>

                    <p className="text-cinza-texto-secundario mt-1">
                        Aba para ter um controle geral dos imóveis alugados
                    </p>
                </div>

                {/* Seleção do imóvel */}
                <div className="relative w-[280px]">
                    <select value={imovelSelecionado} onChange={(e) => {
                        setImovelSelecionado(Number(e.target.value));
                        setPaginaAtual(1);
                    }} className="appearance-none w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 pr-12 shadow-sm cursor-pointer outline-none text-sm">
                        {imoveis.length === 0 ? (
                            <option value="">
                                Nenhum imóvel cadastrado
                            </option>
                        ) : (
                            imoveis.map((imovel) => (
                                <option key={imovel.id} value={imovel.id}>
                                    {imovel.titulo}
                                </option>
                            ))
                        )}
                    </select>

                    <Icons.LuChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
            </div>

            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {metricas.map((item) => (
                    <div key={item.id} className="bg-white p-5 rounded-2xl border border-borda-cards shadow-sm flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-cinza-texto-secundario font-medium">
                                {item.title}
                            </span>

                            <span className="text-2xl font-bold text-preto-texto-principal mt-1">
                                {item.value}
                            </span>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            {item.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-3">
                {[
                    'Todos',
                    'Próximas',
                    'Em Andamento',
                    'Finalizadas',
                    'Canceladas',
                ].map((nomeFiltro) => (
                    <button key={nomeFiltro} onClick={() => {
                        setFiltro(nomeFiltro);
                        setPaginaAtual(1);
                    }}
                        className={`px-5 py-2 rounded-xl font-medium text-sm transition-all
                            ${filtro === nomeFiltro
                                ? 'bg-[#A57849] text-white shadow-sm'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }
                        `}>
                        {nomeFiltro} ({quantidadeFiltro(nomeFiltro)})
                    </button>
                ))}
            </div>

            {/* Lista de reservas */}
            <div className="flex flex-col gap-3">
                <span className="text-sm text-cinza-texto-secundario font-medium">
                    Visualização de todos os usuários que enviaram pedidos
                </span>

                {/* Cabeçalho */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4">
                    <div className="grid grid-cols-5 gap-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div>Hóspede</div>
                        <div>Estadia</div>
                        <div>Valor</div>
                        <div>Hóspedes</div>
                        <div>Status</div>
                    </div>
                </div>

                {/* Carregando reservas */}
                {carregandoReservas ? (
                    <div className="bg-white rounded-2xl border border-borda-cards p-8 text-center">
                        <p className="text-cinza-texto-secundario font-semibold">
                            Carregando reservas...
                        </p>
                    </div>

                ) : reservasFiltradas.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-borda-cards p-8 text-center">
                        <p className="text-cinza-texto-secundario font-semibold">
                            Nenhuma reserva encontrada para este imóvel.
                        </p>
                    </div>
                ) : (

                    <div className="flex flex-col gap-3">
                        {reservasExibidas.map((reserva) => (
                            <CardReserva key={reserva.id} reserva={reserva} imovel={imovelAtual} />
                        ))}
                    </div>
                )}

                {/* Paginação */}
                <div className="mt-4 flex items-center justify-center gap-4 select-none">
                    {/* Anterior */}
                    <button onClick={() =>
                        setPaginaAtual((prev) =>
                            Math.max(prev - 1, 1)
                        )
                    } disabled={paginaAtual === 1} className="flex items-center gap-1 text-cinza-texto-secundario hover:text-preto-principal transition-colors text-sm font-medium group disabled:opacity-30 disabled:cursor-not-allowed">

                        <Icons.IoIosArrowBack size={16} className="transition-transform group-hover:-translate-x-1" />
                        Anterior
                    </button>

                    {/* Números */}
                    <div className="flex items-center gap-2">
                        {Array.from(
                            { length: totalPaginas },
                            (_, i) => i + 1
                        ).map((numero) => {

                            if (
                                numero === 1 ||
                                numero === totalPaginas ||
                                (
                                    numero >= paginaAtual - 1 &&
                                    numero <= paginaAtual + 1
                                )
                            ) {

                                return (
                                    <button key={numero} onClick={() => setPaginaAtual(numero)
                                    } className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors ${paginaAtual === numero
                                        ? 'bg-[#A57849] text-white font-bold shadow-sm'
                                        : 'border border-borda-cards text-preto-principal font-medium hover:bg-fundo-cards'
                                        }`}>
                                        {numero}
                                    </button>
                                );
                            } if (
                                numero === paginaAtual + 2 ||
                                numero === paginaAtual - 2
                            ) {

                                return (
                                    <div key={numero} className="w-8 h-8 flex items-center justify-center border border-borda-cards text-cinza-texto-secundario rounded-md text-sm italic">
                                        ...
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>

                    {/* Próximo */}
                    <button onClick={() =>
                        setPaginaAtual((prev) =>
                            Math.min(prev + 1, totalPaginas)
                        )
                    }
                        disabled={
                            paginaAtual === totalPaginas ||
                            totalPaginas === 0
                        } className="flex items-center gap-1 text-preto-principal hover:text-beje-principal transition-colors text-sm font-medium group disabled:opacity-30 disabled:cursor-not-allowed">
                        Próximo
                        <Icons.IoIosArrowForward size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div >
    );
}

export default ControleUnico;