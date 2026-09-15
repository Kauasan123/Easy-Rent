import { useNavigate, useLocation } from 'react-router-dom';
import * as Icons from '../icons/icons';
import HeaderLogado from '../components/HeaderLogado.jsx';
import Footer from '../components/Footer.jsx';

function ConclusaoPagamento() {

    const navigate = useNavigate();
    const location = useLocation();

    const { imovel, checkIn, checkOut, hospedes, reservaCodigo } = location.state || {};

    const formatarData = (data) => {
        if (!data) return 'Não informado';

        const dataObj = new Date(data);

        if (isNaN(dataObj.getTime())) {
            return 'Data inválida';
        }

        return dataObj.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <header>
                <HeaderLogado />
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">

                {/* Indicador de Passos */}
                <div className="flex items-center gap-3 mb-8 flex-wrap">
                    <span className="bg-[#D1C2B3] text-white px-5 py-2 rounded-full font-medium text-sm">
                        1. Revisão de Reserva
                    </span>

                    <span className="bg-[#D1C2B3] text-white px-5 py-2 rounded-full font-medium text-sm">
                        2. Tela de Pagamento
                    </span>

                    <div className="flex flex-col items-center">
                        <span className="bg-beje-principal text-white px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-sm">
                            3. Conclusão
                        </span>

                        <div className="w-full h-[1px] bg-black mt-2 rounded-full"></div>
                    </div>
                </div>

                {/* Conteúdo centralizado */}
                <div className="flex flex-col items-center">

                    {/* Ícone de Sucesso e Mensagem */}
                    <div className="flex flex-col items-center text-center mb-8">

                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <span className="text-green-600 text-5xl font-bold">
                                <Icons.MdDone size={50} />
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-green-600 mb-2">
                            Confirmado
                        </h1>

                        <p className="text-xl text-gray-900 font-medium">
                            Estadia confirmada com sucesso
                        </p>

                    </div>

                    {/* Card de Detalhes da Reserva */}
                    <div className="w-full max-w-lg bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden mb-8">

                        <div className="bg-white px-6 py-4 border-b border-gray-300">
                            <h2 className="text-xl font-bold text-gray-900">
                                Detalhes
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-200 px-6 py-2">

                            <div className="py-3 flex justify-between items-center text-gray-800">
                                <span className="font-semibold text-gray-900">
                                    Hospedagem
                                </span>
                                <span className="text-gray-700">
                                    {imovel?.titulo}
                                </span>
                            </div>

                            <div className="py-3 flex justify-between items-center text-gray-800">
                                <span className="font-semibold text-gray-900">
                                    Check-in
                                </span>
                                <span className="text-gray-700">
                                    {formatarData(checkIn)}
                                </span>
                            </div>

                            <div className="py-3 flex justify-between items-center text-gray-800">
                                <span className="font-semibold text-gray-900">
                                    Check-out
                                </span>
                                <span className="text-gray-700">
                                    {formatarData(checkOut)}
                                </span>
                            </div>

                            <div className="py-3 flex justify-between items-center text-gray-800">
                                <span className="font-semibold text-gray-900">
                                    Pessoas
                                </span>
                                <span className="text-gray-700">
                                    {hospedes} {Number(hospedes) === 1 ? 'Hóspede' : 'Hóspedes'}
                                </span>
                            </div>

                            <div className="py-3 flex justify-between items-center text-gray-800">
                                <span className="font-semibold text-gray-900">
                                    Cod Reserva
                                </span>
                                <span className="text-gray-700 font-mono font-medium">
                                    {reservaCodigo}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg justify-center">

                        <button onClick={() => navigate('/verReservas')} className="w-full sm:w-auto bg-[#A37B53] hover:bg-[#8e6a48] text-white font-medium px-8 py-3.5 rounded-xl transition-colors shadow-sm text-center">
                            Ver Reserva
                        </button>

                        <button onClick={() => navigate('/principal')} className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-medium px-8 py-3.5 rounded-xl transition-colors text-center">
                            Voltar a pagina inicial
                        </button>

                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default ConclusaoPagamento;