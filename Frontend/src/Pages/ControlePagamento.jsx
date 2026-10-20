import { useState, useEffect } from 'react';
import * as Icons from '../icons/icons.js';

function ControlePagamento() {
    const [pagamentos, setPagamentos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const usuarioId = sessionStorage.getItem('usuarioId');

    const [filtroStatus, setFiltroStatus] = useState('Todos');
    const [imovelSelecionado, setImovelSelecionado] = useState('Todos os imóveis');
    const [busca, setBusca] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);

    const itensPorPagina = 4;

    useEffect(() => {
        let ativo = true;

        async function buscarPagamentos() {
            if (!usuarioId) {
                setErro('Não foi possível identificar o usuário logado.');
                setCarregando(false);
                return;
            }

            try {
                setCarregando(true);
                setErro('');

                const resposta = await fetch(
                    `http://localhost:5000/api/pagamentos/usuario/${encodeURIComponent(usuarioId)}`
                );

                if (!resposta.ok) {
                    throw new Error(
                        'Não foi possível carregar os pagamentos.'
                    );
                }

                const dados = await resposta.json();

                if (!Array.isArray(dados)) {
                    throw new Error(
                        'O servidor retornou um formato de dados inválido.'
                    );
                }

                const pagamentosFormatados = dados.map((pagamento) => {
                    const reserva = pagamento.reserva || {};
                    const hospede = reserva.hospede || {};
                    const imovel = reserva.imovel || {};

                    const dataPagamento = pagamento.dataPagamento
                        ? new Date(pagamento.dataPagamento)
                        : null;

                    const dataValida =
                        dataPagamento &&
                        !Number.isNaN(dataPagamento.getTime());

                    return {
                        id: pagamento.id,

                        hospede: hospede.nome || 'Hóspede',
                        avatar: hospede.avatarPath || null,
                        hospedes: reserva.hospedes ?? 0,

                        imovel: imovel.titulo || 'Imóvel',

                        endereco: [
                            imovel.bairro,
                            imovel.cidade
                        ].filter(Boolean).join(', '),

                        data: dataValida
                            ? dataPagamento.toLocaleDateString('pt-BR')
                            : '—',

                        hora: dataValida
                            ? dataPagamento.toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                            : 'Aguardando pagamento',

                        dataPagamento: dataValida
                            ? dataPagamento
                            : null,

                        valor: Number(pagamento.valor) || 0,

                        metodo: pagamento.metodo || 'Não informado',

                        finalCartao: pagamento.finalCartao || null,

                        status: pagamento.status || 'Pendente'
                    };
                });

                if (ativo) {
                    setPagamentos(pagamentosFormatados);
                }
            } catch (error) {
                console.error(
                    'Erro ao carregar pagamentos:',
                    error
                );

                if (ativo) {
                    setErro(
                        error.message ||
                        'Ocorreu um erro ao carregar os pagamentos.'
                    );
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        buscarPagamentos();

        return () => {
            ativo = false;
        };
    }, [usuarioId]);

    const agora = new Date();

    const pagamentosPagos = pagamentos.filter(
        (pagamento) =>
            pagamento.status === 'Pago' &&
            pagamento.dataPagamento instanceof Date &&
            !Number.isNaN(pagamento.dataPagamento.getTime())
    );

    const totalRecebido = pagamentosPagos.reduce(
        (total, pagamento) => total + pagamento.valor,
        0
    );

    const totalTransacoes = pagamentos.length;

    const pagamentosRealizados = pagamentos.filter(
        (pagamento) => pagamento.status === 'Pago'
    ).length;

    const pagamentosCancelados = pagamentos.filter(
        (pagamento) => pagamento.status === 'Cancelado'
    ).length;

    const ganhosAno = pagamentosPagos
        .filter((pagamento) =>
            pagamento.dataPagamento.getFullYear() ===
            agora.getFullYear()
        )
        .reduce(
            (total, pagamento) => total + pagamento.valor,
            0
        );

    const ganhosMes = pagamentosPagos
        .filter((pagamento) =>
            pagamento.dataPagamento.getFullYear() ===
            agora.getFullYear() &&
            pagamento.dataPagamento.getMonth() ===
            agora.getMonth()
        )
        .reduce(
            (total, pagamento) => total + pagamento.valor,
            0
        );

    const pagamentosFiltrados = pagamentos.filter((pagamento) => {
        const correspondeStatus =
            filtroStatus === 'Todos' ||
            (
                filtroStatus === 'Pagos' &&
                pagamento.status === 'Pago'
            ) ||
            (
                filtroStatus === 'Cancelados' &&
                pagamento.status === 'Cancelado'
            );

        const correspondeImovel =
            imovelSelecionado === 'Todos os imóveis' ||
            pagamento.imovel === imovelSelecionado;

        const termo = busca.trim().toLowerCase();

        const correspondeBusca =
            (pagamento.hospede || '')
                .toLowerCase()
                .includes(termo) ||
            (pagamento.imovel || '')
                .toLowerCase()
                .includes(termo) ||
            (pagamento.endereco || '')
                .toLowerCase()
                .includes(termo);

        return (
            correspondeStatus &&
            correspondeImovel &&
            correspondeBusca
        );
    });

    const totalPaginas = Math.ceil(
        pagamentosFiltrados.length / itensPorPagina
    );

    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;

    const pagamentosExibidos = pagamentosFiltrados.slice(
        indicePrimeiroItem,
        indiceUltimoItem
    );

    useEffect(() => {
        setPaginaAtual(1);
    }, [filtroStatus, imovelSelecionado, busca]);

    useEffect(() => {
        if (totalPaginas > 0 && paginaAtual > totalPaginas) {
            setPaginaAtual(totalPaginas);
        }

        if (totalPaginas === 0 && paginaAtual !== 1) {
            setPaginaAtual(1);
        }
    }, [totalPaginas, paginaAtual]);

    const formatarValor = (valor) => {
        return Number(valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const renderMetodoPagamento = (metodo, finalCartao) => {
        const metodoNormalizado = (metodo || '')
            .toLowerCase()
            .trim();

        if (metodoNormalizado.includes('pix')) {
            return (
                <span className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">
                    Pix
                </span>
            );
        }

        const bandeiras = {
            visa: 'bg-blue-600 text-white',
            mastercard: 'bg-red-500 text-white',
            elo: 'bg-black text-white'
        };

        const bandeira = metodoNormalizado.includes('mastercard')
            ? 'mastercard'
            : metodoNormalizado.includes('visa')
                ? 'visa'
                : metodoNormalizado.includes('elo')
                    ? 'elo'
                    : null;

        const classe = bandeira
            ? bandeiras[bandeira]
            : '';

        return (
            <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-preto-texto-principal">
                    {bandeira ? 'Pago no cartão' : metodo}
                </span>

                <div className="flex items-center gap-2 flex-wrap">
                    {bandeira && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${classe}`}>
                            {metodo}
                        </span>
                    )}

                    {finalCartao && (
                        <span className="text-xs font-semibold text-preto-texto-principal">
                            **** {finalCartao}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const renderStatus = (status) => {
        const estilos = {
            Pago: 'bg-green-100 text-green-700',
            Pendente: 'bg-yellow-100 text-yellow-700',
            Cancelado: 'bg-red-100 text-red-700'
        };

        const classe =
            estilos[status] || 'bg-gray-100 text-gray-700';

        return (
            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${classe}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-10 flex flex-col gap-6 lg:gap-8">
            <div>
                <h1 className="text-preto-texto-principal text-3xl font-bold">
                    Controle de Pagamentos
                </h1>

                <p className="text-cinza-texto-secundario">
                    Acompanhe todos os pagamentos e sua situação financeira
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4">

                <div className="bg-white border border-borda-cards rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0">
                        <Icons.FaDollarSign size={28} />
                    </div>

                    <div>
                        <p className="text-sm font-bold text-preto-texto-principal">
                            Total recebido
                        </p>

                        <p className="text-2xl font-bold text-green-600">
                            {formatarValor(totalRecebido)}
                        </p>

                        <p className="text-xs text-cinza-texto-secundario">
                            Em todos os pagamentos aprovados
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-borda-cards rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-yellow-500 text-white flex items-center justify-center shrink-0">
                        <Icons.FaCalendarAlt size={28} />
                    </div>

                    <div>
                        <p className="text-sm font-bold text-preto-texto-principal">
                            Ganhos do ano
                        </p>

                        <p className="text-2xl font-bold text-preto-texto-principal">
                            {formatarValor(ganhosAno)}
                        </p>

                        <p className="text-xs text-cinza-texto-secundario">
                            Ganhos de {agora.getFullYear()}
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-borda-cards rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                        <Icons.FaChartLine size={28} />
                    </div>

                    <div>
                        <p className="text-sm font-bold text-preto-texto-principal">
                            Ganhos este mês
                        </p>

                        <p className="text-2xl font-bold text-preto-texto-principal">
                            {formatarValor(ganhosMes)}
                        </p>

                        <p className="text-xs text-cinza-texto-secundario">
                            Ganhos de {agora.toLocaleDateString('pt-BR', {
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-borda-cards rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Icons.FaExchangeAlt size={28} />
                    </div>

                    <div>
                        <p className="text-sm font-bold text-preto-texto-principal">
                            Total de transações
                        </p>

                        <p className="text-2xl font-bold text-preto-texto-principal">
                            {totalTransacoes}
                        </p>

                        <p className="text-xs text-cinza-texto-secundario">
                            Total de pagamentos registrados
                        </p>
                    </div>
                </div>

            </div>

            <div className="flex flex-col xl:flex-row xl:items-center gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => setFiltroStatus('Todos')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${filtroStatus === 'Todos'
                        ? 'bg-beje-principal text-white'
                        : 'bg-white border border-borda-cards text-cinza-texto-secundario hover:bg-fundo-cards'
                        }`}>
                        Todos ({totalTransacoes})
                    </button>

                    <button onClick={() => setFiltroStatus('Pagos')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${filtroStatus === 'Pagos'
                        ? 'bg-beje-principal text-white'
                        : 'bg-white border border-borda-cards text-cinza-texto-secundario hover:bg-fundo-cards'
                        }`}>
                        Pagos ({pagamentosRealizados})
                    </button>

                    <button onClick={() => setFiltroStatus('Cancelados')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${filtroStatus === 'Cancelados'
                        ? 'bg-beje-principal text-white'
                        : 'bg-white border border-borda-cards text-cinza-texto-secundario hover:bg-fundo-cards'
                        }`}>
                        Cancelados ({pagamentosCancelados})
                    </button>

                </div>

                <div className="relative w-full xl:w-[220px] shrink-0">
                    <select value={imovelSelecionado} onChange={(e) => setImovelSelecionado(e.target.value)} className="appearance-none w-full h-11 px-4 pr-10 bg-white border border-borda-cards rounded-xl text-sm font-semibold text-cinza-texto-secundario outline-none cursor-pointer">
                        <option value="Todos os imóveis">
                            Todos os imóveis
                        </option>

                        {[...new Set(
                            pagamentos.map((p) => p.imovel)
                        )].map((imovel) => (
                            <option key={imovel} value={imovel}>
                                {imovel}
                            </option>
                        ))}
                    </select>

                    <Icons.IoIosArrowDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative w-full xl:flex-1 xl:max-w-[320px]">
                    <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar hóspede ou imóvel..." className="w-full h-11 pl-4 pr-11 bg-white border border-borda-cards rounded-xl text-sm outline-none focus:border-beje-principal" />

                    <Icons.IoIosSearch size={22} className="absolute right-3 top-1/2 -translate-y-1/2 text-cinza-texto-secundario" />
                </div>

            </div>

            <div className="w-full">
                <div className="w-full bg-white border border-borda-cards rounded-2xl overflow-hidden">

                    <div className="grid grid-cols-[1.3fr_1.2fr_1fr_0.7fr_1.3fr_0.8fr] bg-fundo-cards border-b border-borda-cards">

                        <div className="px-4 py-4 font-bold text-sm">
                            Hóspede
                        </div>

                        <div className="px-4 py-4 font-bold text-sm">
                            Imóvel
                        </div>

                        <div className="px-4 py-4 font-bold text-sm">
                            Data de Pagamento
                        </div>

                        <div className="px-4 py-4 font-bold text-sm">
                            Valor
                        </div>

                        <div className="px-4 py-4 font-bold text-sm">
                            Método de Pagamento
                        </div>

                        <div className="px-4 py-4 font-bold text-sm">
                            Status
                        </div>

                    </div>

                    {carregando ? (
                        <div className="py-12 text-center">
                            <p className="text-cinza-texto-secundario font-semibold">
                                Carregando pagamentos...
                            </p>
                        </div>
                    ) : erro ? (
                        <div className="py-12 px-4 text-center">
                            <p className="text-red-600 font-semibold">
                                {erro}
                            </p>

                            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 rounded-xl bg-beje-principal text-white font-bold text-sm">
                                Tentar novamente
                            </button>
                        </div>
                    ) : pagamentosExibidos.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-cinza-texto-secundario font-semibold">
                                Nenhum pagamento encontrado.
                            </p>
                        </div>
                    ) : (
                        pagamentosExibidos.map((pagamento) => (
                            <div key={pagamento.id} className="grid grid-cols-[1.3fr_1.2fr_1fr_0.7fr_1.3fr_0.8fr] min-h-[82px] border-b border-borda-cards last:border-b-0">
                                <div className="px-4 py-3 flex items-center gap-3 min-w-0">

                                    <div className="w-11 h-11 rounded-full border border-zinc-300 shrink-0 overflow-hidden">
                                        <AvatarUsuario nome={pagamento.hospede} src={pagamento.avatar} className="w-full h-full" textoClassName="text-sm"/>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-bold text-sm truncate">
                                            {pagamento.hospede}
                                        </p>

                                        <p className="text-xs font-semibold text-cinza-texto-secundario flex items-center gap-1">
                                            <Icons.IoPeopleSharp size={13} />
                                            {pagamento.hospedes} Hóspedes
                                        </p>
                                    </div>

                                </div>

                                <div className="px-4 py-3 flex flex-col justify-center min-w-0">
                                    <p className="text-xs font-bold flex items-center gap-1 truncate">
                                        <Icons.FaHouseChimney size={13} />

                                        <span className="truncate">
                                            {pagamento.imovel}
                                        </span>
                                    </p>

                                    <p className="text-xs font-semibold text-cinza-texto-secundario truncate">
                                        {pagamento.endereco || 'Endereço não informado'}
                                    </p>

                                </div>

                                <div className="px-4 py-3 flex flex-col justify-center min-w-0">
                                    <p className="text-xs font-bold">
                                        {pagamento.data}
                                    </p>

                                    <p className="text-xs font-semibold text-cinza-texto-secundario">
                                        {pagamento.hora}
                                    </p>
                                </div>

                                <div className="px-4 py-3 flex items-center min-w-0">
                                    <span className="text-xs font-bold whitespace-nowrap">
                                        {formatarValor(pagamento.valor)}
                                    </span>
                                </div>

                                <div className="px-4 py-3 flex items-center min-w-0">
                                    {renderMetodoPagamento(
                                        pagamento.metodo,
                                        pagamento.finalCartao
                                    )}
                                </div>

                                <div className="px-4 py-3 flex items-center justify-start">
                                    {renderStatus(pagamento.status)}
                                </div>

                            </div>
                        ))
                    )}

                </div>
            </div>

            {!carregando && !erro && totalPaginas > 1 && (
                <div className="mt-6 flex items-center justify-center gap-6 select-none">

                    <button onClick={() => setPaginaAtual((prev) =>
                        Math.max(prev - 1, 1)
                    )
                    } disabled={paginaAtual === 1} className="flex items-center gap-1 text-cinza-texto-secundario hover:text-preto-principal transition-colors text-sm font-medium group disabled:opacity-30 disabled:cursor-not-allowed">
                        <Icons.IoIosArrowBack size={16} className="transition-transform group-hover:-translate-x-1"
                        /> Anterior
                    </button>

                    <div className="flex items-center gap-1">
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
                                    <button
                                        key={numero}
                                        onClick={() =>
                                            setPaginaAtual(numero)
                                        }
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${paginaAtual === numero
                                            ? 'bg-[#A57849] text-white font-bold'
                                            : 'text-preto-principal font-medium hover:bg-fundo-cards'
                                            }`}
                                    >
                                        {numero}
                                    </button>
                                );
                            }

                            if (
                                numero === paginaAtual + 2 ||
                                numero === paginaAtual - 2
                            ) {
                                return (
                                    <span key={numero} className="w-8 h-8 flex items-center justify-center text-cinza-texto-secundario text-sm">
                                        ...
                                    </span>
                                );
                            }

                            return null;
                        })}
                    </div>

                    <button onClick={() => setPaginaAtual((prev) =>
                        Math.min(prev + 1, totalPaginas)
                    )
                    } disabled={paginaAtual === totalPaginas} className="flex items-center gap-1 text-cinza-texto-secundario hover:text-preto-principal transition-colors text-sm font-medium group disabled:opacity-30 disabled:cursor-not-allowed">
                        Próximo

                        <Icons.IoIosArrowForward size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default ControlePagamento;