import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderLogado from '../components/HeaderLogado.jsx';
import Footer from '../components/Footer.jsx';
import Calendario from '../components/Calendario.jsx';
import * as Icons from '../icons/icons.js';

function RevisaoReserva() {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        imovel,
        checkIn: checkInInicial,
        checkOut: checkOutInicial,
        hospedes: hospedesInicial
    } = location.state || {};

    const [checkIn, setCheckIn] = useState(
        checkInInicial ? new Date(checkInInicial) : null
    );

    const [checkOut, setCheckOut] = useState(
        checkOutInicial ? new Date(checkOutInicial) : null
    );
    const [hospedes, setHospedes] = useState(
        hospedesInicial ? String(hospedesInicial) : '1'
    );

    const [editandoDatas, setEditandoDatas] = useState(false);
    const [editandoHospedes, setEditandoHospedes] = useState(false);

    if (!imovel || !checkInInicial || !checkOutInicial || !hospedesInicial) {
        return (
            <>
                <HeaderLogado />

                <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Reserva não encontrada
                        </h1>

                        <p className="text-gray-600 mb-6">
                            Selecione um imóvel e as datas da reserva antes de continuar.
                        </p>

                        <button onClick={() => navigate('/principal')} className="bg-beje-principal hover:bg-botao-beje-apertado text-white font-medium px-6 py-3 rounded-xl transition-colors">
                            Voltar ao início
                        </button>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    const [calendarioAberto, setCalendarioAberto] = useState(false);
    const [periodoSelecionado, setPeriodoSelecionado] = useState(null);

    const dataInicio = new Date(checkIn);
    const dataFim = new Date(checkOut);

    const diferenca = dataFim.getTime() - dataInicio.getTime();

    const diarias = Math.max(
        0,
        Math.ceil(diferenca / (1000 * 60 * 60 * 24))
    );

    const precoNoite = parseFloat(imovel.preco) || 0;

    const subtotal = diarias * precoNoite;

    const taxaServico = subtotal * 0.05;

    const total = subtotal + taxaServico;

    const alterarHospedes = (valor) => {
        if (valor === '') {
            setHospedes('');
            return;
        }

        const numero = Number(valor);

        if (numero < 1) {
            setHospedes('1');
            return;
        }

        const capacidade = Number(imovel.capacidade);

        if (capacidade && numero > capacidade) {
            setHospedes(String(capacidade));
            return;
        }

        setHospedes(valor);
    };

    const finalizarEdicaoHospedes = () => {
        if (hospedes === '' || Number(hospedes) < 1) {
            setHospedes('1');
        }

        setEditandoHospedes(false);
    };

    const finalizarEdicaoDatas = () => {
        if (!checkIn || !checkOut) {
            return;
        }

        const inicio = new Date(checkIn);
        const fim = new Date(checkOut);

        if (fim <= inicio) {
            alert('A data de check-out deve ser posterior ao check-in.');
            return;
        }

        setEditandoDatas(false);
    };

    const formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatarData = (data) => {
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const imagem =
        imovel.imagens?.[0]?.url ||
        '/placeholder-imovel.jpg';

    const comodidades = [
        { nome: 'Wi-Fi', permitido: imovel.hasWifi },
        { nome: 'Máquina de lavar', permitido: imovel.hasMaquinaLavar },
        { nome: 'Ar-condicionado', permitido: imovel.hasArCondicionado },
        { nome: 'Churrasqueira', permitido: imovel.hasChurrascaria },
        { nome: 'Estacionamento', permitido: imovel.hasEstacionamento },
        { nome: 'Elevador', permitido: imovel.hasElevador },
        { nome: 'Piscina', permitido: imovel.hasPiscina },
        { nome: 'TV', permitido: imovel.hasTv }
    ].filter(item => item.permitido);

    const regras = [
        {
            nome: 'Aceita animais',
            permitido: imovel.aceitaPets
        },
        {
            nome: 'Permite festas',
            permitido: imovel.permiteFestas
        },
        {
            nome: 'Acessibilidade',
            permitido: imovel.acessibilidade
        },
        {
            nome: 'Ambiente não fumante',
            permitido: imovel.naoFumante
        }
    ];

    return (
        <>
            <header>
                <HeaderLogado />
            </header>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

                {/* Indicador de Passos */}
                <div className="flex items-center gap-3 mb-8 flex-wrap">

                    <div className="flex flex-col items-center">
                        <span className="bg-beje-principal text-white px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-sm">
                            1. Revisão de Reserva
                        </span>

                        <div className="w-full h-[1px] bg-black mt-2 rounded-full"></div>
                    </div>

                    <span className="bg-[#D1C2B3] text-white px-5 py-2 rounded-full font-medium text-sm">
                        2. Tela de Pagamento
                    </span>

                    <span className="bg-[#D1C2B3] text-white px-5 py-2 rounded-full font-medium text-sm">
                        3. Conclusão
                    </span>

                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Revisão de Reserva
                </h1>

                <div className="grid grid-cols-12 gap-12">

                    {/* COLUNA ESQUERDA */}
                    <div className="col-span-7 space-y-8">

                        {/* Sua Estadia */}
                        <div className="border-b border-gray-200 pb-6">

                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Sua Estadia
                            </h2>

                            <div className="flex justify-between items-start py-2">
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">
                                        Datas
                                    </p>

                                    {editandoDatas ? (
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setCalendarioAberto(true)}
                                                className="text-left text-gray-600 hover:text-[#A37B53] transition-colors"
                                            >
                                                {checkIn && checkOut ? (
                                                    <>
                                                        {checkIn.toLocaleDateString('pt-BR')} →{' '}
                                                        {checkOut.toLocaleDateString('pt-BR')}
                                                    </>
                                                ) : (
                                                    'Selecionar datas'
                                                )}
                                            </button>

                                            {calendarioAberto && (
                                                <div className="absolute z-50 top-full left-0 mt-2 bg-white border border-borda-cards rounded-2xl shadow-2xl p-4 w-[350px] max-w-[calc(100vw-40px)]">
                                                    <p className="text-xs font-bold text-cinza-texto-secundario mb-3 uppercase">
                                                        Selecione um período disponível
                                                    </p>

                                                    {imovel.periodos && imovel.periodos.length > 0 ? (
                                                        <div className="flex flex-col gap-2">

                                                            {imovel.periodos.map((p, i) => {
                                                                const inicio = new Date(p.inicio);
                                                                const fim = new Date(p.fim);

                                                                const selecionado =
                                                                    periodoSelecionado?.inicio?.getTime() ===
                                                                    inicio.getTime();

                                                                return (
                                                                    <div
                                                                        key={i}
                                                                        className="flex flex-col gap-2"
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setPeriodoSelecionado({
                                                                                    inicio,
                                                                                    fim
                                                                                });

                                                                                setCheckIn(null);
                                                                                setCheckOut(null);
                                                                            }}
                                                                            className={`text-left px-3 py-2 border rounded-xl text-xs font-semibold transition-all ${selecionado
                                                                                    ? 'bg-beje-principal text-white border-beje-principal'
                                                                                    : 'border-borda-cards text-preto-texto-principal hover:bg-beje-principal hover:text-white hover:border-beje-principal'
                                                                                }`}
                                                                        >
                                                                            {inicio.toLocaleDateString(
                                                                                'pt-BR'
                                                                            )}{' '}
                                                                            →{' '}
                                                                            {fim.toLocaleDateString(
                                                                                'pt-BR'
                                                                            )}
                                                                        </button>

                                                                        {selecionado && (
                                                                            <div className="flex flex-col gap-2 p-3 bg-fundo-cards border border-borda-cards rounded-xl">

                                                                                <Calendario
                                                                                    startDate={checkIn}
                                                                                    endDate={checkOut}
                                                                                    setStartDate={setCheckIn}
                                                                                    setEndDate={setCheckOut}
                                                                                    minDate={inicio}
                                                                                    maxDate={fim}
                                                                                />

                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setCalendarioAberto(
                                                                                            false
                                                                                        );
                                                                                    }}
                                                                                    disabled={
                                                                                        !checkIn ||
                                                                                        !checkOut
                                                                                    }
                                                                                    className="w-full mt-1 bg-preto-texto-principal hover:bg-zinc-800 disabled:opacity-50 text-white py-2 rounded-lg text-xs font-bold transition-colors"
                                                                                >
                                                                                    Confirmar datas
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-cinza-texto-secundario italic">
                                                            Nenhum período disponível.
                                                        </p>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCalendarioAberto(false);
                                                            setPeriodoSelecionado(null);
                                                        }}
                                                        className="w-full mt-3 text-xs text-cinza-texto-secundario hover:text-preto-texto-principal font-semibold transition-colors"
                                                    >
                                                        Fechar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">
                                            {checkIn && checkOut
                                                ? `${checkIn.toLocaleDateString(
                                                    'pt-BR'
                                                )} → ${checkOut.toLocaleDateString('pt-BR')}`
                                                : 'Nenhuma data selecionada'}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        if (editandoDatas) {
                                            finalizarEdicaoDatas();
                                        } else {
                                            setEditandoDatas(true);
                                            setCalendarioAberto(true);
                                        }
                                    }}
                                    className="font-semibold text-gray-900 underline hover:text-[#A37B53] transition-colors ml-4"
                                >
                                    Editar
                                </button>
                            </div>

                            <div className="flex justify-between items-center py-3 mt-2">
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">
                                        Pessoas
                                    </p>

                                    {editandoHospedes ? (
                                        <div className="flex items-center gap-3 mt-2">
                                            <input
                                                type="number"
                                                min="1"
                                                max={Number(imovel.capacidade) || 99}
                                                value={hospedes}
                                                onChange={(e) => alterarHospedes(e.target.value)}
                                                onFocus={(e) => e.target.select()}
                                                onBlur={finalizarEdicaoHospedes}
                                                className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#A37B53]"
                                            />

                                            <span className="text-sm text-gray-500">
                                                máx. {imovel.capacidade || 99}
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">
                                            {hospedes} {Number(hospedes) === 1 ? 'Hóspede' : 'Hóspedes'}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        if (editandoHospedes) {
                                            finalizarEdicaoHospedes();
                                        } else {
                                            setEditandoHospedes(true);
                                        }
                                    }}
                                    className="font-semibold text-gray-900 underline hover:text-[#A37B53] transition-colors ml-4"
                                >
                                    {editandoHospedes ? 'Concluir' : 'Editar'}
                                </button>
                            </div>


                        </div>

                        {/* Detalhes do Imóvel */}
                        <div className="border-b border-gray-200 pb-6">

                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Detalhes do Imóvel
                            </h2>

                            <div className="mb-5">
                                <h3 className="font-bold text-lg text-gray-900">
                                    {imovel.titulo}
                                </h3>

                                <p className="text-gray-600 mt-1">
                                    {imovel.cidade} - {imovel.bairro}
                                </p>

                            </div>

                            <div className="grid grid-cols-2 gap-y-5 gap-x-10">
                                {imovel.quartos && <div className="flex items-center gap-2 font-bold"><Icons.IoIosBed className="text-beje-principal" size={19} /> <span>Quartos</span></div>}
                                {imovel.vagas && <div className="flex items-center gap-2 font-bold"><Icons.FaCar className="text-beje-principal" size={19} /> <span>Vagas</span></div>}
                                {imovel.banheiros && <div className="flex items-center gap-2 font-bold"><Icons.BiSolidBath className="text-beje-principal" size={19} /> <span>Banheiros</span></div>}
                                {imovel.hasWifi && <div className="flex items-center gap-2 font-bold"><Icons.FaWifi className="text-beje-principal" size={19} /> <span>Wi-Fi</span></div>}
                                {imovel.hasMaquinaLavar && <div className="flex items-center gap-2 font-bold"><Icons.LuWind className="text-beje-principal" size={19} /> <span>Ar-Condicionado</span></div>}
                                {imovel.hasChurrascaria && <div className="flex items-center gap-2 font-bold"><Icons.MdOutlineOutdoorGrill className="text-beje-principal" size={19} /> <span>Churrascaria</span></div>}
                                {imovel.hasEstacionamento && <div className="flex items-center gap-2 font-bold"><Icons.FaCar className="text-beje-principal" size={19} /> <span>Estacionamento</span></div>}
                                {imovel.hasElevador && <div className="flex items-center gap-2 font-bold"><Icons.PiElevator className="text-beje-principal" size={19} /> <span>Elevador</span></div>}
                                {imovel.hasPiscina && <div className="flex items-center gap-2 font-bold"><Icons.FaSwimmingPool className="text-beje-principal" size={19} /> <span>Piscina</span></div>}
                                {imovel.hasPortaria24h && <div className="flex items-center gap-2 font-bold"><Icons.MdOutlineShieldMoon className="text-beje-principal" size={19} /> <span>Portaria 24h</span></div>}
                                {imovel.hasTv && <div className="flex items-center gap-2 font-bold"><Icons.FaTv className="text-beje-principal" size={19} /> <span>TV</span></div>}
                                {!imovel.hasWifi && !imovel.hasMaquinaLavar && !imovel.hasArCondicionado && !imovel.hasChurrascaria &&
                                    !imovel.hasEstacionamento && !imovel.hasElevador && !imovel.hasPiscina && !imovel.hasPortaria24h && !imovel.hasTv && (
                                        <p className="text-xs text-cinza-texto-secundario italic col-span-2">Nenhuma comodidade cadastrada.</p>
                                    )}
                            </div>

                        </div>

                        {/* Regras do Imóvel */}
                        <div className="pb-6">

                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Regras do Imóvel
                            </h2>

                            <div className="flex flex-col gap-4">
                                {imovel.aceitaPets && <div className="flex items-center gap-2 font-bold"><Icons.FaDog className="text-beje-principal" size={19} /> <span>Aceita Pets</span></div>}
                                {imovel.permiteFestas && <div className="flex items-center gap-2 font-bold"><Icons.BiParty className="text-beje-principal" size={19} /> <span>Permite Festas</span></div>}
                                {imovel.acessibilidade && <div className="flex items-center gap-2 font-bold"><Icons.FaWheelchair className="text-beje-principal" size={19} /> <span>Acessibilidade</span></div>}
                                {imovel.naoFumante && <div className="flex items-center gap-2 font-bold"><Icons.FaBanSmoking className="text-beje-principal" size={19} /> <span>Não Fumante</span></div>}
                                {!imovel.aceitaPets && !imovel.permiteFestas && !imovel.acessibilidade && !imovel.naoFumante && (
                                    <p className="text-xs text-cinza-texto-secundario italic">Nenhuma regra cadastrada.</p>
                                )}
                            </div>

                        </div>

                        {/* Botões */}
                        <div className="flex items-center gap-4 pt-4">

                            <button onClick={() => {
                                if (diarias <= 0) {
                                    alert('Selecione datas válidas para a reserva.');
                                    return;
                                }

                                navigate('/pagamento', {
                                    state: {
                                        imovel,
                                        checkIn,
                                        checkOut,
                                        hospedes,
                                        diarias,
                                        subtotal,
                                        taxaServico,
                                        total
                                    }
                                });
                                }} className="bg-beje-principal hover:bg-botao-beje-apertado text-white font-medium px-8 py-3.5 rounded-xl transition-colors shadow-sm" >
                                Ir para o Pagamento
                            </button>

                            <button onClick={() => navigate('/principal')} className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-medium px-8 py-3.5 rounded-xl transition-colors">
                                Voltar ao Início
                            </button>

                        </div>

                    </div>

                    {/* COLUNA DIREITA */}
                    <div className="col-span-5">

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm top-8">

                            {/* Imóvel */}
                            <div className="flex gap-4 items-center pb-4 border-b border-gray-200">

                                <img src={imagem} alt={imovel.titulo} className="w-20 h-20 object-cover rounded-xl" />

                                <div>

                                    <h3 className="font-bold text-gray-900 text-lg">
                                        {imovel.titulo}
                                    </h3>

                                    <div className="flex items-center gap-5 mt-3">

                                        <div className="flex items-center gap-2 font-semibold text-gray-700">
                                            <Icons.IoIosBed size={22} className="text-preto-principal" />
                                            <span className="text-sm">
                                                {imovel.quartos} Quartos
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 font-semibold text-gray-700">
                                            <Icons.FaCar size={20} className="text-preto-principal" />
                                            <span className="text-sm">
                                                {imovel.vagas} Vagas
                                            </span>
                                        </div>

                                    </div>

                                    <p className="text-sm text-gray-900 font-medium mt-1">
                                        {diarias} {diarias === 1 ? 'noite' : 'noites'}
                                    </p>

                                </div>

                            </div>

                            {/* Informações da reserva */}
                            <div className="py-4 space-y-3 border-b border-gray-200 text-sm text-gray-700">

                                <div className="flex items-center gap-2 font-medium text-gray-900">
                                    <Icons.IoPeopleSharp size={20} className="text-preto-principal" />
                                    <span>
                                        {hospedes} {Number(hospedes) === 1 ? 'Hóspede' : 'Hóspedes'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 font-medium text-gray-900">
                                    <Icons.FaCalendarAlt size={20} className="text-preto-principal" />
                                    <span>
                                        {formatarData(dataInicio)} → {formatarData(dataFim)}
                                    </span>
                                </div>

                            </div>

                            {/* Valores */}
                            <div className="py-4 space-y-4 border-b border-gray-200">

                                <div className="flex justify-between items-center text-gray-700">

                                    <span>
                                        R$ {formatarMoeda(precoNoite)} × {diarias} noites
                                    </span>

                                    <span className="border border-gray-300 px-3 py-1 rounded-lg font-medium text-gray-900 bg-gray-50">
                                        R$ {formatarMoeda(subtotal)}
                                    </span>

                                </div>

                                <div className="flex justify-between items-center text-gray-700">

                                    <span>
                                        Taxa de Serviço 5%
                                    </span>

                                    <span className="border border-gray-300 px-3 py-1 rounded-lg font-medium text-gray-900 bg-gray-50">
                                        R$ {formatarMoeda(taxaServico)}
                                    </span>

                                </div>

                            </div>

                            {/* Total */}
                            <div className="pt-6 flex justify-between items-center">

                                <span className="text-lg font-bold text-gray-900">
                                    Total (BRL)
                                </span>

                                <span className="text-xl font-extrabold text-gray-900 border-b-2 border-gray-900 pb-0.5">
                                    R$ {formatarMoeda(total)}
                                </span>

                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <footer>
                <Footer />
            </footer>
        </>
    );
}

export default RevisaoReserva;