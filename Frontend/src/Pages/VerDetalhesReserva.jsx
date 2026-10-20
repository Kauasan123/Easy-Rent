import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import HeaderLogado from '../components/HeaderLogado'
import Footer from '../components/Footer'
import * as Icons from '../icons/icons.js'
import ModalAviso from '../components/ModalAviso'
import AvatarUsuario from '../components/AvatarUsuario';

function VerDetalhesReserva() {

    const navigate = useNavigate()
    const { id } = useParams()

    const [reserva, setReserva] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')
    const [telaCancelar, setTelaCancelar] = useState(null)

    const handleCancelarReserva = async () => {
        setTelaCancelar('carregando')

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/reservas/${reserva.id}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'Cancelada'
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                setTelaCancelar(null)
                alert(data.erro || 'Não foi possível cancelar a reserva.')
                return
            }

            setReserva(prev => ({
                ...prev,
                status: 'Cancelada'
            }))

            setTelaCancelar('sucesso')

        } catch (error) {
            console.error('Erro ao cancelar reserva:', error)
            setTelaCancelar(null)
            alert('Erro ao conectar com o servidor.')
        }
    }

    useEffect(() => {
        const carregarReserva = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/reservas/${id}`
                )

                const data = await response.json()

                if (!response.ok) {
                    setErro(data.erro || 'Erro ao carregar a reserva.')
                    return
                }

                setReserva(data)

            } catch (error) {
                console.error('Erro ao carregar reserva:', error)
                setErro('Erro ao conectar com o servidor.')
            } finally {
                setCarregando(false)
            }
        }

        if (id) {
            carregarReserva()
        }
    }, [id])

    useEffect(() => {
        if (telaCancelar !== 'sucesso') return

        const timer = setTimeout(() => {
            navigate('/verReservas')
        }, 3000)

        return () => clearTimeout(timer)
    }, [telaCancelar, navigate])

    const formatarData = (data) => {
        if (!data) return ''

        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const calcularDias = () => {
        if (!reserva) return 0;

        const inicio = new Date(reserva.inicio);
        const fim = new Date(reserva.fim);

        const diferenca = fim - inicio;

        return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
    };

    const formatarMoeda = (valor) => {
        return Number(valor || 0).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }


    const obterUrlImagem = (imagem) => {
        const caminho = typeof imagem === 'string'
            ? imagem
            : imagem?.url

        if (!caminho) {
            return '/placeholder-imovel.jpg'
        }

        if (caminho.startsWith('http')) {
            return caminho
        }

        return `${import.meta.env.VITE_API_URL}${caminho}`
    }

    if (carregando) {
        return (
            <>
                <header>
                    <HeaderLogado />
                </header>

                <main className="max-w-[1060px] mx-auto px-6 py-10">
                    <p className="text-center text-cinza-texto-secundario">
                        Carregando detalhes da reserva...
                    </p>
                </main>

                <footer>
                    <Footer />
                </footer>
            </>
        )
    }


    if (erro || !reserva) {
        return (
            <>
                <header>
                    <HeaderLogado />
                </header>

                <main className="max-w-[1060px] mx-auto px-6 py-10">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">
                            Reserva não encontrada
                        </h1>

                        <p className="text-cinza-texto-secundario mb-6">
                            {erro || 'Não foi possível encontrar esta reserva.'}
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/detalhesReserva')}
                            className="bg-beje-principal hover:bg-botao-beje-apertado text-white font-semibold px-6 py-3 rounded-xl"
                        >
                            Voltar para Minhas Reservas
                        </button>
                    </div>
                </main>

                <footer>
                    <Footer />
                </footer>
            </>
        )
    }

    const imagemImovel = obterUrlImagem(
        reserva.imovel?.imagens?.[0]
    )

    const dias = calcularDias()
    const precoNoite = parseFloat(reserva.imovel?.preco) || 0
    const subtotal = dias * precoNoite
    const taxaServico = subtotal * 0.05
    const total = subtotal + taxaServico

    return (
        <>
            <header>
                <HeaderLogado />
            </header>

            <main className="max-w-[1060px] mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-preto-texto-principal mb-8">
                    Detalhes da Reserva
                </h1>

                <section className="border border-borda-cards rounded-xl p-4 md:p-5 mb-4">
                    <div className="flex flex-col md:flex-row gap-6">

                        <img src={imagemImovel} alt={reserva.imovel.titulo} className="w-full md:w-[272px] h-[250px] object-cover rounded-xl" />

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                <div>
                                    <h2 className="text-2xl font-bold text-preto-texto-principal">
                                        {reserva.imovel.titulo}
                                    </h2>

                                    <div className="flex items-center gap-1.5 mt-1 text-cinza-texto-secundario">
                                        <Icons.FaLocationDot size={13} />
                                        <span className="text-sm">
                                            {reserva.imovel?.bairro}, {reserva.imovel?.cidade}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-2">
                                        <Icons.FaStar size={18} className="text-icone-estrela" />

                                        <span className="text-sm font-semibold">
                                            {reserva.imovel.avaliacao}
                                        </span>

                                        <span className="text-sm font-semibold">
                                            ({reserva.imovel.quantidadeAvaliacoes} Avaliação)
                                        </span>

                                    </div>
                                </div>

                                <span className="inline-flex items-center gap-1.5 bg-green-200 text-green-700 px-4 py-2 rounded-lg font-semibold whitespace-nowrap">
                                    <Icons.FaCircleCheck size={18} />
                                    {reserva.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-7 gap-y-3 mt-7 pb-3 border-b border-borda-cards">
                                <div className="flex items-center gap-2 font-semibold">
                                    <Icons.FaWifi size={17} />
                                    <span className="text-sm">
                                        Wi-Fi
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 font-semibold">
                                    <Icons.LuWind size={18} />
                                    <span className="text-sm">
                                        Ar-Condicionado
                                    </span>
                                </div>


                                <div className="flex items-center gap-2 font-semibold">
                                    <Icons.FaCar size={17} />
                                    <span className="text-sm">
                                        Estacionamento
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 font-semibold">
                                    <Icons.FaSwimmingPool size={18} />
                                    <span className="text-sm">
                                        Piscina
                                    </span>
                                </div>

                                <span className="text-sm font-semibold">
                                    +5 Comodidades
                                </span>
                            </div>

                            <div className="mt-3">
                                <h3 className="font-bold text-sm mb-1">
                                    Descrição:
                                </h3>
                                <p className="text-sm leading-5 text-preto-texto-principal max-w-[700px]">
                                    {reserva.imovel.descricao}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border border-borda-cards rounded-xl px-12 py-4 mb-4">
                    <h2 className="text-2xl font-bold mb-1">
                        Sua Estadia
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 mt-1">
                        <div className="py-2 md:pr-6 md:border-r border-borda-cards">
                            <h3 className="font-bold mb-1">
                                Check-in
                            </h3>

                            <div className="flex items-center gap-2 font-semibold">
                                <Icons.FaCalendarAlt size={17} />
                                <span>
                                    {formatarData(reserva.inicio)}
                                </span>
                            </div>
                        </div>

                        <div className="py-2 md:px-6 md:border-r border-borda-cards">
                            <h3 className="font-bold mb-1">
                                Check-out
                            </h3>

                            <div className="flex items-center gap-2 font-semibold">
                                <Icons.FaCalendarAlt size={17} />
                                <span>
                                    {formatarData(reserva.fim)}
                                </span>
                            </div>

                        </div>

                        <div className="py-2 md:px-6 md:border-r border-borda-cards">
                            <h3 className="font-bold mb-1">
                                Hóspedes
                            </h3>

                            <div className="flex items-center gap-2 font-semibold">
                                <Icons.IoPeopleSharp size={19} />
                                <span>
                                    {reserva.hospedes} {reserva.hospedes === 1 ? 'Hóspede' : 'Hóspedes'}
                                </span>
                            </div>
                        </div>

                        <div className="py-2 md:pl-6">
                            <h3 className="font-bold mb-1">
                                Duração
                            </h3>

                            <div className="flex items-center gap-2 font-semibold">
                                <Icons.LuTimer size={19} />
                                <span>
                                    {dias} {dias === 1 ? 'Dia' : 'Dias'}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="border border-borda-cards rounded-xl px-12 py-4 min-h-[220px]">

                        <h2 className="text-2xl font-bold mb-5">
                            Anfitrião
                        </h2>

                        <div className="flex items-center gap-4">
                            <AvatarUsuario nome={reserva.imovel?.usuario?.nome || 'Anfitrião'} src={reserva.imovel?.usuario?.avatarPath
                                ? `${import.meta.env.VITE_API_URL}${reserva.imovel.usuario.avatarPath}`
                                : null} className="w-[88px] h-[88px]" textoClassName="text-3xl" />

                            <div>
                                <h3 className="text-lg font-bold mb-2">
                                    {reserva.imovel?.usuario?.nome || 'Não informado'}
                                </h3>

                                <button type="button" className="flex items-center gap-2 border border-beje-principal text-beje-principal px-3 py-2 rounded-md font-semibold hover:bg-beje-principal hover:text-white transition-colors" >
                                    <Icons.MdOutlineMailOutline size={20} />
                                    Enviar Mensagem
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="border border-borda-cards rounded-xl px-12 py-4 min-h-[220px]">
                        <h2 className="text-2xl font-bold mb-3">
                            Pagamento
                        </h2>

                        <div className="space-y-1 text-base">
                            <div className="flex justify-between">
                                <span>
                                    R$ {formatarMoeda(precoNoite)} x {dias} noites
                                </span>

                                <span>
                                    R$ {formatarMoeda(subtotal)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Taxa de Serviço 5%
                                </span>

                                <span>
                                    R$ {formatarMoeda(taxaServico)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-borda-cards mt-2 pt-2 flex justify-between items-center">
                            <span className="text-base">
                                Total Pago
                            </span>

                            <span className="text-xl font-extrabold">
                                R$ {formatarMoeda(total)}
                            </span>
                        </div>

                        <div className="mt-1">
                            <span className="inline-flex items-center gap-1.5 bg-green-200 text-green-700 px-3 py-1 rounded-md text-sm font-semibold">
                                <Icons.FaCircleCheck size={15} />
                                Pagamento Confirmado
                            </span>
                        </div>

                    </section>

                    <section className="border border-borda-cards rounded-xl px-12 py-4 min-h-[220px]">
                        <h2 className="text-2xl font-bold mb-4">
                            Regras da Casa
                        </h2>

                        <div className="space-y-3 font-semibold">
                            {reserva.imovel?.aceitaPets && (
                                <div className="flex items-center gap-2">
                                    <Icons.FaDog size={19} />
                                    <span>Aceita Pets</span>
                                </div>
                            )}

                            {reserva.imovel?.permiteFestas && (
                                <div className="flex items-center gap-2">
                                    <Icons.BiParty size={20} />
                                    <span>Permite Festas</span>
                                </div>
                            )}

                            {reserva.imovel?.acessibilidade && (
                                <div className="flex items-center gap-2">
                                    <Icons.FaWheelchair size={19} />
                                    <span>Acessibilidade</span>
                                </div>
                            )}

                            {reserva.imovel?.naoFumante && (
                                <div className="flex items-center gap-2">
                                    <Icons.FaBanSmoking size={19} />
                                    <span>Não Fumante</span>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="border border-borda-cards rounded-xl px-12 py-4 min-h-[220px]">
                        <h2 className="text-2xl font-bold mb-2">
                            Precisa de Ajuda?
                        </h2>

                        <p className="text-base leading-5 mb-4 max-w-[370px]">
                            Entre em contato com o anfitrião ou com
                            nosso suporte caso precise de algo
                        </p>

                        <div className="space-y-2 mt-6">
                            <button type="button" className="w-[85%] mx-auto flex items-center justify-center gap-2 border border-beje-principal text-beje-principal px-4 py-2 rounded-md font-semibold hover:bg-beje-principal hover:text-white transition-colors">
                                <Icons.MdOutlineMailOutline size={20} />
                                Falar com o Anfitrião
                            </button>
                        </div>
                    </section>
                </div>

                <div className="flex justify-center items-center gap-5 mt-5">
                    <button type="button" onClick={() => navigate('/principal')} className="bg-beje-principal hover:bg-botao-beje-apertado text-white font-semibold px-8 py-3 rounded-xl transition-colors">
                        Voltar a tela Inicial
                    </button>

                    <button type="button" onClick={() => setTelaCancelar('confirmacao')} className="bg-white hover:bg-gray-50 text-preto-texto-principal border border-gray-700 font-semibold px-8 py-3 rounded-xl transition-colors">
                        Cancelar Reserva
                    </button>
                </div>

            </main>

            <footer>
                <Footer />
            </footer>

            {telaCancelar && (
                <ModalAviso
                    tipo={telaCancelar}
                    onConfirmar={handleCancelarReserva}
                    onCancelar={() => setTelaCancelar(null)}
                />
            )}
        </>
    )
}

export default VerDetalhesReserva