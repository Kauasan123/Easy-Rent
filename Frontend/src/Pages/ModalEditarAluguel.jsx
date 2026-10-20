import { useState, useEffect } from 'react'
import * as Icons from '../icons/icons'
import CheckBox from '../components/CheckBox.jsx';
import Stepper from '../components/Stepper.jsx';
import Calendario from '../components/Calendario.jsx';
import { MdImage } from 'react-icons/md';
import { MdCloudUpload } from 'react-icons/md';
import toast from 'react-hot-toast';

function ModalEditarAluguel({ isOpen, onClose, imovel, onUpdateSuccess }) {
    const [passoAtual, setPassoAtual] = useState(1);
    const [titulo, setTitulo] = useState('');
    const [tipoImovel, setTipoImovel] = useState('casa');
    const [descricao, setDescricao] = useState('');
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cep, setCep] = useState('');
    const [preco, setPreco] = useState('');
    const [tipoPreco, setTipoPreco] = useState('noite');
    const [capacidade, setCapacidade] = useState('1-pessoa');

    const [comodidades, setComodidades] = useState({
        hasWifi: false, hasMaquinaLavar: false, hasArCondicionado: false, hasChurrascaria: false,
        hasEstacionamento: false, hasElevador: false, hasPiscina: false, hasPortaria24h: false, hasTv: false
    });

    const [detalhes, setDetalhes] = useState({
        proximoCentro: false, proximoPraia: false
    });

    const [quartos, setQuartos] = useState(1);
    const [banheiros, setBanheiros] = useState(1);
    const [vagas, setVagas] = useState(1);

    const [imagensSalvas, setImagensSalvas] = useState([]);
    const [novasImagens, setNovasImagens] = useState([]);

    const [calendarioAberto, setCalendarioAberto] = useState(false);
    const [dataInicio, setDataInicio] = useState(null);
    const [dataFim, setDataFim] = useState(null);
    const [periodosDisponiveis, setPeriodosDisponiveis] = useState([]);

    const [proximoCentro, setProximoCentro] = useState(false);
    const [proximoPraia, setProximoPraia] = useState(false);

    const [regras, setRegras] = useState({
        aceitaPets: false,
        permiteFestas: false,
        acessibilidade: false,
        naoFumante: false
    });

    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        const carregarDadosDoImovel = async () => {
            if (!imovel?.id) return;

            setNovasImagens([]);

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/imoveis/${imovel.id}`);
                const data = await response.json();

                const dados = data.imoveis ? data.imoveis[0] : data;
                if (!dados) return;

                // Dados Básicos
                setTitulo(dados.titulo || '');
                setTipoImovel(dados.tipo || 'casa');
                setDescricao(dados.descricao || '');
                setCidade(dados.cidade || '');
                setBairro(dados.bairro || '');
                setEndereco(dados.endereco || '');
                setCep(dados.cep || '');
                setPreco(dados.preco || '');
                setTipoPreco(dados.tipoCobranca || 'noite');
                setCapacidade(dados.capacidade || '1-pessoa');
                setQuartos(dados.quartos || 1);
                setBanheiros(dados.banheiros || 1);
                setVagas(dados.vagas || 1);

                // Comodidades
                setComodidades({
                    hasWifi: dados.hasWifi || false,
                    hasMaquinaLavar: dados.hasMaquinaLavar || false,
                    hasArCondicionado: dados.hasArCondicionado || false,
                    hasChurrascaria: dados.hasChurrascaria || false,
                    hasEstacionamento: dados.hasEstacionamento || false,
                    hasElevador: dados.hasElevador || false,
                    hasPiscina: dados.hasPiscina || false,
                    hasPortaria24h: dados.hasPortaria24h || false,
                    hasTv: dados.hasTv || false
                });

                // Detalhes (Centro/Praia)
                setDetalhes({
                    proximoCentro: dados.proximoCentro || false,
                    proximoPraia: dados.proximoPraia || false
                });
                setProximoCentro(dados.proximoCentro || false);
                setProximoPraia(dados.proximoPraia || false);

                // Regras
                setRegras({
                    aceitaPets: dados.aceitaPets || false,
                    permiteFestas: dados.permiteFestas || false,
                    acessibilidade: dados.acessibilidade || false,
                    naoFumante: dados.naoFumante || false
                });

                // Imagens
                if (dados.imagens) {
                    setImagensSalvas(dados.imagens);
                }

                // Períodos
                if (dados.periodos && Array.isArray(dados.periodos)) {
                    const formatados = dados.periodos.map(p => ({
                        id: p.id,
                        inicio: p.inicio.split('T')[0],
                        fim: p.fim.split('T')[0]
                    }));
                    setPeriodosDisponiveis(formatados);
                }

            } catch (error) {
                console.error("Erro ao carregar modal:", error);
            }
        };

        if (isOpen) {
            carregarDadosDoImovel();
        } else {

            setNovasImagens([]);
        }

    }, [isOpen, imovel?.id]);

    const handleComodidadeChange = (key) => {
        setComodidades(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleDetalheChange = (key) => {
        if (key === 'proximoCentro') setProximoCentro(!proximoCentro);
        if (key === 'proximoPraia') setProximoPraia(!proximoPraia);
        setDetalhes(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleRegraChange = (key) => {
        setRegras(prev => ({ ...prev, [key]: !prev[key] }));
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
        setCalendarioAberto(false);
    };

    const formatarDataParaInput = (dataIso) => {
        if (!dataIso) return '';
        return new Date(dataIso).toISOString().split('T')[0];
    };

    const handleRemoverPeriodo = (id) => {
        setPeriodosDisponiveis(periodosDisponiveis.filter(p => p.id !== id));
    };

    const handleFileChange = (e) => {
        const arquivos = Array.from(e.target.files);
        setNovasImagens(prev => [...prev, ...arquivos].slice(0, 10));
    };

    const obterUrlImagem = (index) => {
        if (imagensSalvas[index]) {
            const url = imagensSalvas[index].url;
            if (url.startsWith('http')) return url;
            return `${import.meta.env.VITE_API_URL}${url}`;
        }

        const slotNova = index - imagensSalvas.length;
        if (slotNova >= 0 && novasImagens[slotNova]) {
            return URL.createObjectURL(novasImagens[slotNova]);
        }

        return null;
    };

    const handleRemoverImagem = async (index) => {
        if (novasImagens[index - imagensSalvas.length] !== undefined) {
            const slotNova = index - imagensSalvas.length;
            setNovasImagens(prev => prev.filter((_, i) => i !== slotNova));
        } else if (imagensSalvas[index]) {
            const imagem = imagensSalvas[index];
            try {
                await fetch(`${import.meta.env.VITE_API_URL}/imoveis/imagens/${imagem.id}`, {
                    method: 'DELETE'
                });
                setImagensSalvas(prev => prev.filter((_, i) => i !== index));
            } catch (error) {
                console.error("Erro ao deletar imagem:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        Object.keys(comodidades).forEach(key => formData.append(key, comodidades[key]));
        Object.keys(regras).forEach(key => formData.append(key, regras[key]));

        novasImagens.forEach((file) => formData.append('imagens', file));

        formData.append('periodos', JSON.stringify(periodosDisponiveis || []));

        try {
            setCarregando(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/imoveis/${imovel.id}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                toast.success("Imóvel atualizado com sucesso!");
                if (onUpdateSuccess) onUpdateSuccess();
                onClose();
            } else {
                const errorData = await response.json();
                toast.error(`Erro ao atualizar o imóvel: ${errorData.message || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro ao conectar com o servidor");
        } finally {
            setCarregando(false);
        }
    };

    if (!isOpen || !imovel) return null;

    return (
        <>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-preto-principal/60 backdrop-blur-sm p-4 overflow-hidden" onClick={onClose}>
                <div className="bg-white w-full max-w-[1150px] h-[95vh] rounded-3xl relative overflow-y-auto p-6 md:p-10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleSubmit} className="px-12 py-10 flex flex-col gap-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className='text-preto-texto-principal text-3xl font-bold'>Editar Aluguel</h1>
                                <p className='text-cinza-texto-secundario'>Altere as informações necessárias do imóvel</p>
                            </div>
                            <button type="button" onClick={onClose} className="absolute top-6 right-6 p-2 text-preto-texto-principal hover:bg-cinza-fundo-x rounded-full transition-all z-[100]">
                                <Icons.IoIosClose size={32} />
                            </button>
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
                                    <CheckBox id="centro" label="Próximo ao Centro" checked={proximoCentro} onChange={() => handleDetalheChange('proximoCentro')} />
                                    <CheckBox id="praia" label="Próximo à Praia" checked={proximoPraia} onChange={() => handleDetalheChange('proximoPraia')} />
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <Stepper passo={passoAtual} setPasso={setPassoAtual} label="Quartos" value={quartos} onIncrease={() => setQuartos(quartos + 1)} onDecrease={() => quartos > 1 && setQuartos(quartos - 1)} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Stepper passo={passoAtual} setPasso={setPassoAtual} label="Banheiros" value={banheiros} onIncrease={() => setBanheiros(banheiros + 1)} onDecrease={() => banheiros > 1 && setBanheiros(banheiros - 1)} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Stepper passo={passoAtual} setPasso={setPassoAtual} label="Vagas" value={vagas} onIncrease={() => setVagas(vagas + 1)} onDecrease={() => vagas > 0 && setVagas(vagas - 1)} />
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
                                        <label className="border-2 border-dashed border-gray-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50/50 transition-colors bg-white min-h-[200px]">
                                            <input type="file" multiple accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange} />
                                            <MdCloudUpload className="w-12 h-12 text-black mb-3" />
                                            <span className="font-bold text-lg text-preto-texto-principal block">
                                                Clique para Enviar Fotos
                                            </span>
                                            <span className="text-xs text-cinza-texto-secundario mt-1 block">
                                                Ou arraste e solte aqui <br />
                                                Formatos aceitos: JPG, PNG (Máx. 10 fotos)
                                            </span>
                                        </label>

                                        <div className="grid grid-cols-2 gap-3">
                                            {[...Array(4)].map((_, index) => {
                                                const urlImagem = obterUrlImagem(index);
                                                return (
                                                    <div key={index} className="relative bg-[#D9D9D9]/60 border border-borda-cards rounded-2xl flex items-center justify-center h-[140px] overflow-hidden group">
                                                        {urlImagem ? (
                                                            <>
                                                                <img src={urlImagem} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoverImagem(index)}
                                                                    className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-500 hover:text-red-600 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all"
                                                                >
                                                                    <Icons.FaTrashAlt size={12} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <MdImage className="w-8 h-8 text-gray-400" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </section>

                                {/* Botões de Ação Final */}
                                <div className="flex gap-4 items-center mt-2">
                                    <button type="submit" className="px-8 py-3.5 bg-beje-principal hover:bg-botao-beje-apertado text-white font-bold rounded-xl transition-colors shadow-sm text-sm">
                                        Salvar Alterações
                                    </button>
                                    <button type="button" onClick={onClose} className="px-8 py-3.5 bg-white border border-preto-texto-principal hover:bg-botao-branco-apertado text-preto-texto-principal font-bold rounded-xl transition-colors text-sm">
                                        Cancelar Alterações
                                    </button>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ModalEditarAluguel;