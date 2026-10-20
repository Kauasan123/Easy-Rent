import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as Icons from '../icons/icons'
import CheckBox from '../components/CheckBox.jsx';
import Stepper from '../components/Stepper.jsx';
import Calendario from '../components/Calendario.jsx';
import toast from 'react-hot-toast';

function CadastrarAluguel() {
    const navigate = useNavigate();
    const [calendarioAberto, setCalendarioAberto] = useState(false);

    // Estados básicos
    const [titulo, setTitulo] = useState('');
    const [tipoImovel, setTipoImovel] = useState('casa');
    const [descricao, setDescricao] = useState('');

    // Estados de Localização
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cep, setCep] = useState('');

    // Estados de Preço e Capacidade
    const [preco, setPreco] = useState('');
    const [tipoPreco, setTipoPreco] = useState('noite');
    const [capacidade, setCapacidade] = useState('1 Pessoa');

    // Estado das Comodidades
    const [comodidades, setComodidades] = useState({
        hasWifi: false,
        hasMaquinaLavar: false,
        hasArCondicionado: false,
        hasChurrascaria: false,
        hasEstacionamento: false,
        hasElevador: false,
        hasPiscina: false,
        hasPortaria24h: false,
        hasTv: false
    });

    // Estado de Detalhes
    const [proximoCentro, setProximoCentro] = useState(false);
    const [proximoPraia, setProximoPraia] = useState(false);
    const [quartos, setQuartos] = useState(1);
    const [banheiros, setBanheiros] = useState(1);
    const [vagas, setVagas] = useState(1);

    // Estado de Regras
    const [regras, setRegras] = useState({
        aceitaPets: false,
        permiteFestas: false,
        acessibilidade: false,
        naoFumante: false
    });

    // Estados controlados para a Lista Dinâmica vinculada ao seu Calendário
    const [dataInicio, setDataInicio] = useState(null);
    const [dataFim, setDataFim] = useState(null);
    const [periodosDisponiveis, setPeriodosDisponiveis] = useState([]);

    // Estados de Mídia e Envio
    const [imagens, setImagens] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [urlsImagens, setUrlsImagens] = useState([]);

    const preencherAutomatico = () => {
        setTitulo('Casa de Praia Vista Mar');
        setTipoImovel('casa');
        setDescricao('Casa espaçosa com vista incrível para o mar, totalmente equipada e ideal para famílias. Ambiente tranquilo, perfeito para relaxar durante as férias.');
        setCidade('Pelotas');
        setBairro('Laranjal');
        setEndereco('Av. Praia, 456');
        setCep('96015-200');
        setPreco('320');
        setTipoPreco('noite');
        setCapacidade('3+ Pessoas');
        setComodidades({
            hasWifi: true,
            hasMaquinaLavar: true,
            hasArCondicionado: true,
            hasChurrascaria: true,
            hasEstacionamento: true,
            hasElevador: false,
            hasPiscina: true,
            hasPortaria24h: false,
            hasTv: true
        });
        setProximoCentro(true);
        setProximoPraia(true);
        setQuartos(3);
        setBanheiros(2);
        setVagas(2);
        setRegras({
            aceitaPets: true,
            permiteFestas: false,
            acessibilidade: false,
            naoFumante: true
        });
        setPeriodosDisponiveis([
            { id: Date.now(), inicio: '2026-07-10', fim: '2026-07-25' },
            { id: Date.now() + 1, inicio: '2026-08-05', fim: '2026-08-20' }
        ]);
    };

    // Handlers
    const handleFileChange = (e) => {
        const arquivos = Array.from(e.target.files);
        const novasUrls = arquivos.map(file => URL.createObjectURL(file));
        setImagens((prev) => [...prev, ...arquivos].slice(0, 10));
        setUrlsImagens((prev) => [...prev, ...novasUrls].slice(0, 10));
    };

    const handleComodidadeChange = (campo) => {
        setComodidades(prev => ({ ...prev, [campo]: !prev[campo] }));
    };

    const handleRegraChange = (campo) => {
        setRegras(prev => ({ ...prev, [campo]: !prev[campo] }));
    };

    const handleAdicionarPeriodo = () => {
        if (!dataInicio || !dataFim) return;

        const novoPeriodo = {
            id: Date.now(),
            inicio: dataInicio.toISOString().split('T')[0],
            fim: dataFim.toISOString().split('T')[0]
        };

        setPeriodosDisponiveis([...periodosDisponiveis, novoPeriodo]);

        setDataInicio(null);
        setDataFim(null);
    };

    const handleRemoverPeriodo = (id) => {
        setPeriodosDisponiveis(periodosDisponiveis.filter(p => p.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);

        const usuarioId = sessionStorage.getItem('usuarioId');

        if (!usuarioId) {
            toast.error('Você precisa estar logado para cadastrar um imóvel.');
            setCarregando(false);
            return;
        }

        try {
            const formData = new FormData();

            formData.append('titulo', titulo);
            formData.append('tipo', tipoImovel);
            formData.append('descricao', descricao);
            formData.append('cidade', cidade);
            formData.append('bairro', bairro);
            formData.append('endereco', endereco);
            formData.append('cep', cep);
            formData.append('preco', preco);
            formData.append('tipoCobranca', tipoPreco);
            formData.append('capacidade', capacidade);

            formData.append('quartos', quartos);
            formData.append('banheiros', banheiros);
            formData.append('vagas', vagas);
            formData.append('usuarioId', usuarioId);

            formData.append('proximoCentro', proximoCentro);
            formData.append('proximoPraia', proximoPraia);

            formData.append('periodos', JSON.stringify(periodosDisponiveis));

            Object.keys(comodidades).forEach(key => {
                formData.append(key, comodidades[key]);
            });

            Object.keys(regras).forEach(key => {
                formData.append(key, regras[key]);
            });

            imagens.forEach((imagem) => {
                formData.append('imagens', imagem);
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/imoveis`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Imóvel anunciado com sucesso!');
                navigate('/aluguel');
            } else {
                toast.error(`Erro: ${data.erro || 'Falha ao cadastrar imóvel'}`);
            }
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            toast.error("Erro de conexão com o servidor.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="px-12 py-10 flex flex-col gap-8">
            <div>
                <h1 onClick={preencherAutomatico} className='text-preto-texto-principal text-3xl font-bold cursor-pointer hover:text-beje-principal transition-colors' title="Clique para preencher automaticamente">
                    Cadastro de Aluguel
                </h1>
                <p className='text-cinza-texto-secundario'>Aba para Cadastrar novos Alugueis</p>
            </div>

            {/* Informações Básicas */}
            <section>
                <div className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-preto-texto-principal mb-6">Informações Básicas</h2>

                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
                            <div className="flex flex-col gap-2">
                                <label className="text-preto-texto-principal font-semibold text-sm">Título do Imóvel</label>
                                <input
                                    type="text"
                                    required
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    placeholder="Ex: Casa do Laranjal"
                                    className="w-full bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal outline-none focus:border-beje-principal transition-colors placeholder:text-gray-300"
                                />
                            </div>

                            {/* Tipo do Imóvel */}
                            <div className="flex flex-col gap-2">
                                <label className="text-preto-texto-principal font-semibold text-sm">Tipo do Imóvel</label>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setTipoImovel('casa')}
                                        className={`flex-1 flex items-center justify-between px-4 py-3 border rounded-xl border-borda-cards outline-none transition-all ${tipoImovel === 'casa' ? 'bg-white' : 'bg-botao-branco-apertado'}`}>
                                        <div className="flex items-center gap-2 font-bold text-sm text-preto-texto-principal">
                                            <Icons.FaHouseChimney size={18} />
                                            <span>Casa</span>
                                        </div>
                                        <div className="w-4 h-4 rounded-full border flex items-center justify-center border-borda-cards">
                                            {tipoImovel === 'casa' && <div className="w-2 h-2 rounded-full bg-black" />}
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setTipoImovel('apartamento')}
                                        className={`flex-1 flex items-center justify-between px-4 py-3 border rounded-xl border-borda-cards outline-none transition-all ${tipoImovel === 'apartamento' ? 'bg-white' : 'bg-botao-branco-apertado'}`}>
                                        <div className="flex items-center gap-2 font-bold text-sm text-preto-texto-principal">
                                            <Icons.FaBuilding size={18} />
                                            <span>Apartamento</span>
                                        </div>
                                        <div className="w-4 h-4 rounded-full border flex items-center justify-center border-borda-cards">
                                            {tipoImovel === 'apartamento' && <div className="w-2 h-2 rounded-full bg-black" />}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Descrição do Imóvel */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-preto-texto-principal font-semibold text-sm">Descrição do Imóvel</label>
                            <div className="relative">
                                <textarea
                                    maxLength={500}
                                    required
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    rows={5}
                                    className="w-full bg-white border border-borda-cards rounded-xl p-4 text-sm font-semibold text-preto-texto-principal outline-none transition-colors resize-none pb-8"
                                />
                                <span className="absolute bottom-3 right-4 text-[10px] font-bold text-gray-400">
                                    {descricao.length}/500
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Localização */}
            <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-preto-texto-principal mb-6">Localização</h2>

                <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-preto-texto-principal font-semibold text-sm">Cidade</label>
                            <input
                                type="text"
                                required
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                                placeholder="Ex: Pelotas"
                                className="w-full bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal outline-none transition-colors placeholder:text-gray-300"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-preto-texto-principal font-semibold text-sm">Bairro</label>
                            <input
                                type="text"
                                required
                                value={bairro}
                                onChange={(e) => setBairro(e.target.value)}
                                placeholder="Ex: Laranjal"
                                className="w-full bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal outline-none transition-colors placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="flex flex-col gap-2 md:col-span-8">
                            <label className="text-preto-texto-principal font-semibold text-sm">Endereço</label>
                            <input
                                type="text"
                                required
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                                placeholder="Ex: Rua Xv, 123"
                                className="w-full bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal outline-none transition-colors placeholder:text-gray-300"
                            />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-4">
                            <label className="text-preto-texto-principal font-semibold text-sm">CEP</label>
                            <input
                                type="text"
                                required
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                placeholder="Ex: 96015-000"
                                className="w-full bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal outline-none transition-colors placeholder:text-gray-300"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Preço */}
                <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm flex flex-col gap-5">
                    <h2 className="text-2xl font-bold text-preto-texto-principal">Preço</h2>

                    <div className="flex flex-col gap-2">
                        <label className="text-preto-texto-principal font-semibold text-sm">
                            {tipoPreco === 'noite' ? 'Preço por Noite' : 'Preço por Mês'}
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-sm font-bold text-gray-400">R$</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                                placeholder="0,00"
                                className="w-full bg-white border border-borda-cards rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-preto-texto-principal outline-none focus:border-beje-principal transition-colors placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-preto-texto-principal font-semibold text-sm">Cobrança</label>
                        <div className="flex gap-6 mt-1">
                            <label className="flex items-center gap-2 cursor-pointer group select-none">
                                <input type="radio" name="tipo_cobranca" checked={tipoPreco === 'noite'} onChange={() => setTipoPreco('noite')} className="hidden" />
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${tipoPreco === 'noite' ? 'border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                    {tipoPreco === 'noite' && <div className="w-2 h-2 rounded-full bg-black" />}
                                </div>
                                <span className={`text-sm font-semibold transition-colors ${tipoPreco === 'noite' ? 'text-preto-texto-principal font-bold' : 'text-cinza-texto-secundario'}`}>
                                    Por Noite
                                </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer group select-none">
                                <input type="radio" name="tipo_cobranca" checked={tipoPreco === 'mes'} onChange={() => setTipoPreco('mes')} className="hidden" />
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${tipoPreco === 'mes' ? 'border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                    {tipoPreco === 'mes' && <div className="w-2 h-2 rounded-full bg-black" />}
                                </div>
                                <span className={`text-sm font-semibold transition-colors ${tipoPreco === 'mes' ? 'text-preto-texto-principal font-bold' : 'text-cinza-texto-secundario'}`}>
                                    Por Mês
                                </span>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Capacidade */}
                <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm flex flex-col gap-5 relative overflow-hidden">
                    <h2 className="text-2xl font-bold text-preto-texto-principal">Capacidade</h2>
                    <div className="flex flex-col gap-4 mt-2">
                        <CheckBox id="1-pessoa" label="1 Pessoa" checked={capacidade === '1 Pessoa'} onChange={() => setCapacidade('1 Pessoa')} />
                        <CheckBox id="2-pessoas" label="2 Pessoas" checked={capacidade === '2 Pessoas'} onChange={() => setCapacidade('2 Pessoas')} />
                        <CheckBox id="3-pessoas" label="3+ Pessoas" checked={capacidade === '3+ Pessoas'} onChange={() => setCapacidade('3+ Pessoas')} />
                    </div>
                </section>
            </div>

            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Comodidades */}
                    <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm flex flex-col gap-5">
                        <h2 className="text-2xl font-bold text-preto-texto-principal">Comodidades</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-1">
                            <CheckBox id="wifi" label="Wi-Fi" checked={comodidades.hasWifi} onChange={() => handleComodidadeChange('hasWifi')} />
                            <CheckBox id="lavar" label="Máquina de Lavar" checked={comodidades.hasMaquinaLavar} onChange={() => handleComodidadeChange('hasMaquinaLavar')} />
                            <CheckBox id="ar" label="Ar-Condicionado" checked={comodidades.hasArCondicionado} onChange={() => handleComodidadeChange('hasArCondicionado')} />
                            <CheckBox id="churras" label="Churrascaria" checked={comodidades.hasChurrascaria} onChange={() => handleComodidadeChange('hasChurrascaria')} />
                            <CheckBox id="vaga" label="Estacionamento" checked={comodidades.hasEstacionamento} onChange={() => handleComodidadeChange('hasEstacionamento')} />
                            <CheckBox id="elevador" label="Elevador" checked={comodidades.hasElevador} onChange={() => handleComodidadeChange('hasElevador')} />
                            <CheckBox id="piscina" label="Piscina" checked={comodidades.hasPiscina} onChange={() => handleComodidadeChange('hasPiscina')} />
                            <CheckBox id="portaria" label="Portaria 24h" checked={comodidades.hasPortaria24h} onChange={() => handleComodidadeChange('hasPortaria24h')} />
                            <CheckBox id="tv" label="TV" checked={comodidades.hasTv} onChange={() => handleComodidadeChange('hasTv')} />
                        </div>
                    </section>

                    {/* Preferência / Regras */}
                    <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm flex flex-col gap-5 w-full h-full justify-start">
                        <h2 className="text-2xl font-bold text-preto-texto-principal">Preferência / Regras</h2>
                        <div className="flex flex-col gap-x-6 gap-y-3 mt-1">
                            <CheckBox id="pets" label="Aceita Pets" checked={regras.aceitaPets} onChange={() => handleRegraChange('aceitaPets')} />
                            <CheckBox id="festas" label="Permite Festas" checked={regras.permiteFestas} onChange={() => handleRegraChange('permiteFestas')} />
                            <CheckBox id="acessibilidade" label="Acessibilidade" checked={regras.acessibilidade} onChange={() => handleRegraChange('acessibilidade')} />
                            <CheckBox id="fumante" label="Não Fumante" checked={regras.naoFumante} onChange={() => handleRegraChange('naoFumante')} />
                        </div>
                    </section>
                </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
                {/* Detalhes do Imóvel */}
                <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm flex flex-col gap-5 h-full">
                    <h2 className="text-2xl font-bold text-preto-texto-principal">Detalhes do Imóvel</h2>

                    <div className="flex flex-col gap-3 mt-1">
                        <CheckBox id="centro" label="Próximo ao Centro" checked={proximoCentro} onChange={() => setProximoCentro(!proximoCentro)} />
                        <CheckBox id="praia" label="Próximo à Praia" checked={proximoPraia} onChange={() => setProximoPraia(!proximoPraia)} />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <Stepper label="Quartos" value={quartos} onIncrease={() => setQuartos(quartos + 1)} onDecrease={() => quartos > 1 && setQuartos(quartos - 1)} />
                        </div>

                        <div className="flex items-center justify-between">
                            <Stepper label="Banheiros" value={banheiros} onIncrease={() => setBanheiros(banheiros + 1)} onDecrease={() => banheiros > 1 && setBanheiros(banheiros - 1)} />
                        </div>

                        <div className="flex items-center justify-between">
                            <Stepper label="Vagas" value={vagas} onIncrease={() => setVagas(vagas + 1)} onDecrease={() => vagas > 0 && setVagas(vagas - 1)} />
                        </div>
                    </div>
                </section>

                {/* Disponibilidade do Imóvel */}
                <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm flex flex-col gap-5 w-full relative h-full">
                    <div>
                        <h2 className="text-2xl font-bold text-preto-texto-principal">Disponibilidade do Imóvel</h2>
                    </div>

                    <div className="flex flex-col gap-2 relative">
                        <label className="text-preto-texto-principal font-semibold text-sm">Selecione o Período</label>
                        <button
                            type="button"
                            onClick={() => setCalendarioAberto(!calendarioAberto)}
                            className="w-full flex items-center justify-between bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal outline-none hover:border-beje-principal transition-all"
                        >
                            {dataInicio && dataFim
                                ? `${dataInicio.toLocaleDateString('pt-BR')} até ${dataFim.toLocaleDateString('pt-BR')}`
                                : "Clique para selecionar datas..."}
                            <Icons.FaCalendarAlt size={16} className="text-gray-400" />
                        </button>

                        <div className={`absolute z-50 top-20 left-0 bg-white border border-borda-cards shadow-2xl rounded-2xl p-4 w-[380px] max-w-[90vw] ${calendarioAberto ? 'block' : 'hidden'}`}>
                            <div className="w-full flex justify-center">
                                <Calendario
                                    startDate={dataInicio}
                                    endDate={dataFim}
                                    setStartDate={setDataInicio}
                                    setEndDate={setDataFim}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setCalendarioAberto(false)}
                                className="w-full mt-3 bg-preto-texto-principal hover:bg-zinc-800 text-white py-2 rounded-xl text-xs font-bold transition-colors"
                            >
                                Confirmar seleção
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-preto-texto-principal font-bold text-xs uppercase tracking-wider">Períodos Salvos</label>
                        <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                            {periodosDisponiveis.length === 0 ? (
                                <p className="text-xs text-center text-gray-400 font-medium py-4 bg-white/50 border border-dashed border-borda-cards rounded-xl">
                                    Nenhum período adicionado.
                                </p>
                            ) : (
                                periodosDisponiveis.map((periodo) => (
                                    <div key={periodo.id} className="flex items-center justify-between bg-white border border-borda-cards rounded-xl px-4 py-2.5">
                                        <span className="text-sm font-bold text-preto-texto-principal">
                                            {periodo.inicio.split('-').reverse().join('/')} até {periodo.fim.split('-').reverse().join('/')}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoverPeriodo(periodo.id)}
                                            className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Botão Adicionar à Lista */}
                    <button
                        type="button"
                        disabled={!dataInicio || !dataFim}
                        onClick={handleAdicionarPeriodo}
                        className="w-full py-3 bg-beje-principal hover:bg-botao-beje-apertado disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
                    >
                        Adicionar Período à Lista
                    </button>
                </section>
            </div>

            {/* Card Principal de Fotos */}
            <section>
                <div className="w-full flex flex-col gap-6">
                    <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-preto-texto-principal mb-5">Fotos do Imóvel</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label
                                className="border-2 border-dashed border-gray-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50/50 transition-colors bg-white"
                                style={{ height: '300px', minHeight: '300px', maxHeight: '300px' }}
                            >
                                <input type="file" multiple accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange} />
                                <Icons.MdCloudUpload size={48} className="text-black mb-3" />
                                <span className="font-bold text-lg text-preto-texto-principal block">
                                    Clique para Enviar Fotos
                                </span>
                                <span className="text-xs text-cinza-texto-secundario mt-1 block">
                                    Ou arraste e solte aqui <br />
                                    Formatos aceitos: JPG, PNG (Máx. 10 fotos)
                                </span>
                            </label>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '12px', height: '300px', minHeight: '300px', maxHeight: '300px' }}>
                                {[...Array(4)].map((_, index) => {
                                    const urlImagem = urlsImagens[index];
                                    return (
                                        <div
                                            key={index}
                                            className="bg-[#D9D9D9]/60 border border-borda-cards flex items-center justify-center group"
                                            style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', minHeight: 0 }}
                                        >
                                            {urlImagem ? (
                                                <>
                                                    <img
                                                        src={urlImagem}
                                                        alt={`Preview ${index + 1}`}
                                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImagens(prev => prev.filter((_, i) => i !== index));
                                                            setUrlsImagens(prev => prev.filter((_, i) => i !== index));
                                                        }}
                                                        className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-500 hover:text-red-600 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <Icons.FaTrashAlt size={12} />
                                                    </button>
                                                </>
                                            ) : (
                                                <Icons.MdImage size={32} className="text-gray-400" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <div className="flex gap-4 items-center mt-2">
                        <button
                            type="submit"
                            disabled={carregando}
                            className="px-8 py-3.5 bg-beje-principal hover:bg-botao-beje-apertado text-white font-bold rounded-xl transition-colors shadow-sm text-sm disabled:opacity-50"
                        >
                            {carregando ? 'Enviando...' : 'Enviar Imóvel'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/aluguel')}
                            className="px-8 py-3.5 bg-white border border-preto-texto-principal hover:bg-botao-branco-apertado text-preto-texto-principal font-bold rounded-xl transition-colors text-sm"
                        >
                            Cancelar Envio
                        </button>
                    </div>
                </div>
            </section>
        </form>
    )
}

export default CadastrarAluguel;