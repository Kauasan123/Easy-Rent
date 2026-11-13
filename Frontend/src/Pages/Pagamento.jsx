import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderLogado from '../components/HeaderLogado.jsx';
import Footer from '../components/Footer.jsx';
import Calendario from '../components/Calendario.jsx';
import * as Icons from '../icons/icons.js';

function Pagamento() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        imovel,
        checkIn,
        checkOut,
        hospedes,
        diarias,
        subtotal,
        taxaServico,
        total
    } = location.state || {};

    const [metodoPagamento, setMetodoPagamento] = useState('Cartão de Crédito');
    const [numeroCartao, setNumeroCartao] = useState('');
    const [validade, setValidade] = useState('');
    const [cvv, setCvv] = useState('');
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataNascimento, setDataNascimento] = useState(null);
    const [textoDataNascimento, setTextoDataNascimento] = useState('');
    const [calendarioNascimentoAberto, setCalendarioNascimentoAberto] = useState(false);
    const [menuPagamentoAberto, setMenuPagamentoAberto] = useState(false);

    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [dadosPix, setDadosPix] = useState(null);

    const reservaId = 31;

    if (!imovel || !checkIn || !checkOut || !hospedes) {
        return (
            <>
                <HeaderLogado />

                <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Reserva não encontrada
                        </h1>

                        <p className="text-gray-600 mb-6">
                            Volte para a revisão da reserva antes de continuar.
                        </p>

                        <button
                            onClick={() => navigate('/principal')}
                            className="bg-beje-principal hover:bg-botao-beje-apertado text-white font-medium px-6 py-3 rounded-xl transition-colors"
                        >
                            Voltar ao início
                        </button>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    const dataInicio = new Date(checkIn);
    const dataFim = new Date(checkOut);

    const precoNoite = parseFloat(imovel.preco) || 0;

    const imagem =
        imovel.imagens?.[0]?.url ||
        '/placeholder-imovel.jpg';

    const formatarMoeda = (valor) => {
        return Number(valor || 0).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatarData = (data) => {
        if (!data) return '';

        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatarNumeroCartao = (valor) => {
        const numeros = valor.replace(/\D/g, '').slice(0, 16);

        return numeros.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatarValidade = (valor) => {
        const numeros = valor.replace(/\D/g, '').slice(0, 4);

        if (numeros.length <= 2) {
            return numeros;
        }

        return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    };

    const formatarCpf = (valor) => {
        const numeros = valor.replace(/\D/g, '').slice(0, 11);

        return numeros
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const formatarTelefone = (valor) => {
        const numeros = valor.replace(/\D/g, '').slice(0, 11);

        if (numeros.length <= 2) {
            return numeros;
        }

        if (numeros.length <= 7) {
            return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
        }

        return `(${numeros.slice(0, 2)}) ${numeros.slice(
            2,
            7
        )}-${numeros.slice(7)}`;
    };

    const confirmarPagamento = async (e) => {
        e.preventDefault();
        setErro('');
        setDadosPix(null);

        if (!nome.trim()) {
            setErro('Informe seu nome.');
            return;
        }

        if (!sobrenome.trim()) {
            setErro('Informe seu sobrenome.');
            return;
        }

        if (!cpf.trim()) {
            setErro('Informe seu CPF.');
            return;
        }

        if (cpf.replace(/\D/g, '').length !== 11) {
            setErro('Informe um CPF válido.');
            return;
        }

        if (!telefone.trim()) {
            setErro('Informe seu telefone.');
            return;
        }

        if (!dataNascimento) {
            setErro('Informe sua data de nascimento.');
            return;
        }

        if (metodoPagamento !== 'Pix') {
            setErro('A integração com o Asaas está disponível somente para Pix no momento.');
            return;
        }

        try {
            setCarregando(true);

            const token = sessionStorage.getItem('token');

            if (!token) {
                setErro('Sua sessão expirou. Faça login novamente.');
                return;
            }

            // Utilizar a reserva que já existe no banco de dados
            if (!reservaId) {
                setErro('Reserva não encontrada.');
                return;
            }

            // Criar a cobrança Pix no Asaas
            const pagamentoResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/pagamentos`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        reservaId: reservaId,
                        metodo: 'Pix',
                        cpf: cpf.replace(/\D/g, '')
                    })
                }
            );

            const pagamentoData = await pagamentoResponse.json();

            if (!pagamentoResponse.ok) {
                setErro(
                    pagamentoData.erro || 'Erro ao gerar cobrança.'
                );
                return;
            }

            if (
                !pagamentoData.pagamento?.pixQrCode ||
                !pagamentoData.pagamento?.pixCopiaECola
            ) {
                setErro('A cobrança foi criada, mas não foi possível obter o QR Code.');
                return;
            }

            // 3. Guardar os dados para exibir o Pix
            setDadosPix({
                ...pagamentoData.pagamento,
                reservaId: reservaId
            });

        } catch (error) {
            console.error('Erro ao gerar pagamento Pix:', error);
            setErro('Erro ao conectar com o servidor.');
        } finally {
            setCarregando(false);
        }
    };

    const preencherDadosDemonstracao = () => {
        setNome('Eduardo');
        setSobrenome('Santos');
        setCpf(formatarCpf('52998224725'));
        setTelefone(formatarTelefone('53991234567'));

        const nascimento = new Date(1998, 4, 15);
        setDataNascimento(nascimento);
        setTextoDataNascimento('15/05/1998');
    };

    return (
        <>
            <header>
                <HeaderLogado />
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">

                {/* Indicador de Passos */}
                <div className="flex items-center gap-3 mb-8 flex-wrap">

                    <span className="bg-[#D1C2B3] text-white px-5 py-2 rounded-full font-medium text-sm">
                        1. Revisão de Reserva
                    </span>

                    <div className="flex flex-col items-center">
                        <span className="bg-beje-principal text-white px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-sm">
                            2. Tela de Pagamento
                        </span>

                        <div className="w-full h-[1px] bg-black mt-2 rounded-full"></div>
                    </div>

                    <span className="bg-[#D1C2B3] text-white px-5 py-2 rounded-full font-medium text-sm">
                        3. Conclusão
                    </span>

                </div>

                <div className="grid grid-cols-12 gap-12">
                    {/* COLUNA ESQUERDA */}
                    <section className="col-span-7">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">
                            <span onClick={preencherDadosDemonstracao} className="cursor-pointer hover:text-beje-principal transition-colors" title="Preencher dados de demonstração" >
                                Revisão
                            </span>{' '}
                            de Reserva
                        </h1>


                        {!dadosPix ? (
                            <form onSubmit={confirmarPagamento}>
                                {/* MÉTODO DE PAGAMENTO */}
                                <div className="relative border border-borda-cards rounded-xl mb-10">
                                    {/* Cabeçalho clicável */}
                                    <button type="button" onClick={() =>
                                        setMenuPagamentoAberto(!menuPagamentoAberto)
                                    } className="w-full flex items-center justify-between px-7 py-4 text-left" >
                                        <div className="flex items-center gap-4 text-xl">
                                            <Icons.FaCreditCard size={20} className="text-preto-principal" />

                                            <span>
                                                {metodoPagamento}
                                            </span>
                                        </div>

                                        <Icons.LuChevronDown size={20} className={`text-preto-principal transition-transform duration-200 ${menuPagamentoAberto ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Opções */}
                                    {menuPagamentoAberto && (
                                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-borda-cards rounded-xl shadow-lg z-50 overflow-hidden">
                                            <button type="button" onClick={() => {
                                                setMetodoPagamento('Cartão de Crédito');
                                                setMenuPagamentoAberto(false);
                                            }} className="w-full text-left px-7 py-4 text-xl hover:bg-gray-200 transition-colors">
                                                Cartão de Crédito
                                            </button>

                                            <button type="button" onClick={() => {
                                                setMetodoPagamento('Pix');
                                                setMenuPagamentoAberto(false);
                                            }} className="w-full text-left px-7 py-4 text-xl hover:bg-gray-200 transition-colors">
                                                Pix
                                            </button>

                                            <button type="button" onClick={() => {
                                                setMetodoPagamento('Boleto');
                                                setMenuPagamentoAberto(false);
                                            }} className="w-full text-left px-7 py-4 text-xl hover:bg-gray-200 transition-colors">
                                                Boleto
                                            </button>

                                        </div>
                                    )}

                                </div>

                                {/* DADOS DO CARTÃO */}
                                {metodoPagamento === 'Cartão de Crédito' && (
                                    <div className="border border-borda-cards rounded-xl overflow-hidden mb-10">

                                        <div className="flex items-center justify-between px-7 py-4 border-b border-borda-cards">
                                            <div className="flex items-center gap-4 text-xl flex-1">
                                                <Icons.IoIosUnlock size={20} className="text-preto-principal" />

                                                <input type="text" placeholder="Número do Cartão" value={numeroCartao} onChange={(e) =>
                                                    setNumeroCartao(
                                                        formatarNumeroCartao(e.target.value)
                                                    )
                                                } className="flex-1 bg-transparent outline-none text-xl placeholder:text-gray-900" maxLength={19} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2">
                                            <input type="text" placeholder="Validade" value={validade} onChange={(e) => setValidade(
                                                formatarValidade(
                                                    e.target.value
                                                )
                                            )
                                            } className="px-7 py-4 text-xl outline-none placeholder:text-gray-900 border-r border-borda-cards" maxLength={5} />

                                            <input type="text" placeholder="CVV" value={cvv} onChange={(e) => setCvv(
                                                e.target.value
                                                    .replace(/\D/g, '')
                                                    .slice(0, 3)
                                            )
                                            } className="px-7 py-4 text-xl outline-none placeholder:text-gray-900" maxLength={3} />
                                        </div>
                                    </div>
                                )}

                                {/* DADOS PESSOAIS */}
                                <div className="border border-borda-cards rounded-xl overflow-visible">

                                    <input type="text" placeholder="Nome" value={nome} onChange={(e) =>
                                        setNome(e.target.value)
                                    }
                                        className="w-full px-7 py-4 text-xl outline-none placeholder:text-gray-900 border-b border-borda-cards" />

                                    <input type="text" placeholder="Sobrenome" value={sobrenome} onChange={(e) =>
                                        setSobrenome(e.target.value)
                                    }
                                        className="w-full px-7 py-4 text-xl outline-none placeholder:text-gray-900 border-b border-borda-cards" />

                                    <input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCpf(
                                        formatarCpf(e.target.value)
                                    )
                                    } className="w-full px-7 py-4 text-xl outline-none placeholder:text-gray-900 border-b border-borda-cards" maxLength={14} />

                                    <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(
                                        formatarTelefone(
                                            e.target.value
                                        )
                                    )
                                    } className="w-full px-7 py-4 text-xl outline-none placeholder:text-gray-900 border-b border-borda-cards" maxLength={15} />

                                    <div className="relative">
                                        <div className="flex items-center">
                                            <input type="text" placeholder="Data de nascimento" value={textoDataNascimento} onChange={(e) => {
                                                let valor = e.target.value
                                                    .replace(/\D/g, '')
                                                    .slice(0, 8);

                                                if (valor.length >= 5) {
                                                    valor =
                                                        valor.slice(0, 2) +
                                                        '/' +
                                                        valor.slice(2, 4) +
                                                        '/' +
                                                        valor.slice(4);
                                                } else if (valor.length >= 3) {
                                                    valor =
                                                        valor.slice(0, 2) +
                                                        '/' +
                                                        valor.slice(2);
                                                }

                                                setTextoDataNascimento(valor);

                                                if (valor.length === 10) {
                                                    const partes = valor.split('/');

                                                    const dia = Number(partes[0]);
                                                    const mes = Number(partes[1]);
                                                    const ano = Number(partes[2]);

                                                    const data = new Date(
                                                        ano,
                                                        mes - 1,
                                                        dia
                                                    );

                                                    if (
                                                        data.getFullYear() === ano &&
                                                        data.getMonth() === mes - 1 &&
                                                        data.getDate() === dia
                                                    ) {
                                                        setDataNascimento(data);
                                                    } else {
                                                        setDataNascimento(null);
                                                    }
                                                } else {
                                                    setDataNascimento(null);
                                                }
                                            }}
                                                className="flex-1 px-7 py-4 text-xl outline-none text-gray-900 placeholder:text-gray-900"
                                                maxLength={10}
                                            />

                                            <button type="button" onClick={() =>
                                                setCalendarioNascimentoAberto(
                                                    !calendarioNascimentoAberto
                                                )
                                            } className="px-6 py-4 text-gray-900 hover:text-beje-principal transition-colors" >
                                                <Icons.FaCalendarAlt size={20} />
                                            </button>
                                        </div>

                                        {calendarioNascimentoAberto && (
                                            <div className="absolute right-0 bottom-full mb-[-5px] bg-white border border-borda-cards rounded-xl shadow-lg z-50 p-4">
                                                <Calendario
                                                    modoDataUnica={true}
                                                    startDate={dataNascimento}
                                                    setStartDate={(data) => {
                                                        setDataNascimento(data);

                                                        if (data) {
                                                            setTextoDataNascimento(
                                                                data.toLocaleDateString('pt-BR')
                                                            );
                                                        }

                                                        setCalendarioNascimentoAberto(false);
                                                    }}
                                                    minDate={new Date(1900, 0, 1)}
                                                    maxDate={new Date()}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ERRO */}
                                {erro && (
                                    <p className="text-red-600 text-sm font-medium mt-4">
                                        {erro}
                                    </p>
                                )}

                                {/* BOTÕES */}
                                <div className="flex items-center gap-5 mt-8">

                                    <button type="submit" disabled={carregando} className="bg-beje-principal hover:bg-botao-beje-apertado disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-8 py-3.5 rounded-xl transition-colors shadow-sm" >
                                        {carregando ? 'Gerando cobrança...' : 'Concluir Pagamento'}
                                    </button>

                                    <button type="button" onClick={() => navigate(-1)} className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-medium px-8 py-3.5 rounded-xl transition-colors">
                                        Cancelar Pagamento
                                    </button>

                                </div>
                            </form>
                        ) : (
                            <div className="border border-borda-cards rounded-xl p-6 mt-6 text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    Pague com PIX
                                </h2>

                                <p className="text-gray-600 mb-6">
                                    Escaneie o QR Code abaixo com o aplicativo do seu banco.
                                </p>

                                <img src={
                                    dadosPix.pixQrCode.startsWith('data:')
                                        ? dadosPix.pixQrCode
                                        : `data:image/png;base64,${dadosPix.pixQrCode}`
                                } alt="QR Code PIX" className="w-64 h-64 object-contain mx-auto mb-6" />

                                <p className="font-semibold text-gray-900 mb-2">
                                    PIX Copia e Cola
                                </p>

                                <textarea readOnly value={dadosPix.pixCopiaECola} className="w-full h-24 p-3 border border-borda-cards rounded-lg text-sm resize-none" />

                                <button type="button" onClick={() =>
                                    navigator.clipboard.writeText(dadosPix.pixCopiaECola)
                                } className="w-full mt-3 bg-beje-principal hover:bg-botao-beje-apertado text-white font-medium px-6 py-3 rounded-xl transition-colors">
                                    Copiar código PIX
                                </button>

                                <p className="text-lg font-bold text-gray-900 mt-6">
                                    Valor: R$ {formatarMoeda(dadosPix.valor)}
                                </p>

                                {dadosPix.expiraEm && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Expira em: {formatarData(dadosPix.expiraEm)}
                                    </p>
                                )}

                                <p className="text-sm text-gray-500 mt-4">
                                    Sua reserva permanecerá pendente até a confirmação do pagamento.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* COLUNA DIREITA */}
                    <div className="col-span-5">

                        <div className="bg-white border border-borda-cards rounded-2xl p-6 shadow-sm top-8">

                            {/* Imóvel */}
                            <div className="flex gap-4 items-center pb-4 border-b border-borda-cards">

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
                            <div className="py-4 space-y-3 border-b border-borda-cards text-sm text-gray-700">

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
                            <div className="py-4 space-y-4 border-b border-borda-cards">

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

                                <span className="text-xl font-extrabold text-gray-900 border-b-2 border-borda-cards pb-0.5">
                                    R$ {formatarMoeda(total)}
                                </span>

                            </div>
                        </div>
                    </div>
                </div>
            </main >

            <footer>
                <Footer />
            </footer>
        </>
    );
}

export default Pagamento;