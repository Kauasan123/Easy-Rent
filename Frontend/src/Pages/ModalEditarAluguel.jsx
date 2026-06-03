import { useState, useEffect } from 'react'
import * as Icons from '../icons/icons'
import CheckBox from '../components/CheckBox.jsx';
import Stepper from '../components/Stepper.jsx';

function ModalEditarAluguel({ isOpen, onClose, imovel, onUpdateSuccess }) {
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
        wifi: false, lavar: false, ar: false, churras: false,
        vaga: false, elevador: false, piscina: false, portaria: false, tv: false
    });

    const [detalhes, setDetalhes] = useState({
        centro: false, praia: false, pets: false, festas: false,
        acessibilidade: false, fumante: false
    });

    const [quartos, setQuartos] = useState(1);
    const [banheiros, setBanheiros] = useState(1);
    const [vagas, setVagas] = useState(1);
    const [imagens, setImagens] = useState([]);

    useEffect(() => {
        if (imovel) {
            setTitulo(imovel.titulo || '');
            setTipoImovel(imovel.tipo || 'casa');
            setDescricao(imovel.descricao || '');
            setCidade(imovel.cidade || '');
            setBairro(imovel.bairro || '');
            setEndereco(imovel.endereco || '');
            setCep(imovel.cep || '');
            setPreco(imovel.preco || '');
            setTipoPreco(imovel.tipoCobranca || 'noite');
            setCapacidade(imovel.capacidade || '1-pessoa');
            setQuartos(imovel.quartos || 1);
            setBanheiros(imovel.banheiros || 1);
            setVagas(imovel.vagas || 1);
            setImagens(imovel.fotos || []);

            setComodidades({
                wifi: imovel.hasWifi || false,
                lavar: imovel.hasMaquinaLavar || false,
                ar: imovel.hasArCondicionado || false,
                churras: imovel.hasChurrascaria || false,
                vaga: imovel.hasEstacionamento || false,
                elevador: imovel.hasElevador || false,
                piscina: imovel.hasPiscina || false,
                portaria: imovel.hasPortaria24h || false,
                tv: imovel.hasTv || false,
            });

            setDetalhes({
                centro: imovel.proximoCentro || false,
                praia: imovel.proximoPraia || false,
                pets: imovel.aceitaPets || false,
                festas: imovel.permiteFestas || false,
                acessibilidade: imovel.acessibilidade || false,
                fumante: imovel.naoFumante || false
            });
        }
    }, [imovel]);

    const handleComodidadeChange = (key) => {
        setComodidades(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleDetalheChange = (key) => {
        setDetalhes(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImagens((prev) => [...prev, ...files].slice(0, 4));
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

        formData.append('hasWifi', comodidades.wifi);
        formData.append('hasMaquinaLavar', comodidades.lavar);
        formData.append('hasArCondicionado', comodidades.ar);
        formData.append('hasChurrascaria', comodidades.churras);
        formData.append('hasEstacionamento', comodidades.vaga);
        formData.append('hasElevador', comodidades.elevador);
        formData.append('hasPiscina', comodidades.piscina);
        formData.append('hasPortaria24h', comodidades.portaria);
        formData.append('hasTv', comodidades.tv);

        formData.append('proximoCentro', detalhes.centro);
        formData.append('proximoPraia', detalhes.praia);
        formData.append('aceitaPets', detalhes.pets);
        formData.append('permiteFestas', detalhes.festas);
        formData.append('acessibilidade', detalhes.acessibilidade);
        formData.append('naoFumante', detalhes.fumante);

        imagens.forEach((img) => {
            if (img instanceof File) {
                formData.append('imagens', img);
            }
        });

        try {
            const response = await fetch(`http://localhost:5000/api/imoveis/${imovel.id}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                alert("Imóvel atualizado com sucesso!");
                if (onUpdateSuccess) onUpdateSuccess();
                onClose();
            } else {
                alert("Erro ao atualizar o imóvel.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    if (!isOpen || !imovel) return null;

    return (
        <>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-preto-principal/60 backdrop-blur-sm p-4 overflow-hidden" onClick={onClose}>
                <div className="bg-white w-full max-w-[1150px] h-[95vh] rounded-3xl relative overflow-y-auto p-6 md:p-10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleSubmit} className="px-12 py-10 flex flex-col gap-8">

                        {/* Header da Modal */}
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
                                            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Casa do Laranjal" className="w-full bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal outline-none focus:border-beje-principal transition-colors placeholder:text-gray-300" />
                                        </div>

                                        {/* Tipo do Imóvel */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-preto-texto-principal font-semibold text-sm">Tipo do Imóvel</label>
                                            <div className="flex gap-4">
                                                <button type="button" onClick={() => setTipoImovel('casa')} className={`flex-1 flex items-center justify-between px-4 py-3 border rounded-xl border-borda-cards outline-none transition-all ${tipoImovel === 'casa' ? 'bg-white' : 'bg-botao-branco-apertado'}`}>
                                                    <div className="flex items-center gap-2 font-bold text-sm text-preto-texto-principal">
                                                        <Icons.FaHouseChimney size={18} />
                                                        <span>Casa</span>
                                                    </div>
                                                    <div className="w-4 h-4 rounded-full border flex items-center justify-center border-borda-cards">
                                                        {tipoImovel === 'casa' && <div className="w-2 h-2 rounded-full bg-black" />}
                                                    </div>
                                                </button>

                                                <button type="button" onClick={() => setTipoImovel('apartamento')} className={`flex-1 flex items-center justify-between px-4 py-3 border rounded-xl border-borda-cards outline-none transition-all ${tipoImovel === 'apartamento' ? 'bg-white' : 'bg-botao-branco-apertado'}`}>
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
                                            <textarea maxLength={500} value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={5} className="w-full bg-white border border-borda-cards rounded-xl p-4 text-sm font-semibold text-preto-texto-principal outline-none transition-colors resize-none pb-8" />
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
                                        <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: Pelotas" className="w-full bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal outline-none transition-colors placeholder:text-gray-300" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-preto-texto-principal font-semibold text-sm">Bairro</label>
                                        <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Ex: Laranjal" className="w-full bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal outline-none transition-colors placeholder:text-gray-300" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="flex flex-col gap-2 md:col-span-8">
                                        <label className="text-preto-texto-principal font-semibold text-sm">Endereço</label>
                                        <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Ex: Rua Xv, 123" className="w-full bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal outline-none transition-colors placeholder:text-gray-300" />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-4">
                                        <label className="text-preto-texto-principal font-semibold text-sm">CEP</label>
                                        <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="Ex: 00000-000" className="w-full bg-white border border-borda-cards rounded-xl px-4 py-3 text-sm font-bold text-preto-texto-principal outline-none transition-colors placeholder:text-gray-300" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Preço e Capacidade */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm flex flex-col gap-5">
                                <h2 className="text-2xl font-bold text-preto-texto-principal">Preço</h2>
                                <div className="flex flex-col gap-2">
                                    <label className="text-preto-texto-principal font-semibold text-sm">
                                        {tipoPreco === 'noite' ? 'Preço por Noite' : 'Preço por Mês'}
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-sm font-bold text-gray-400">R$</span>
                                        <input type="text" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="0,00" className="w-full bg-white border border-borda-cards rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-preto-texto-principal outline-none focus:border-beje-principal transition-colors placeholder:text-gray-300" />
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

                            <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm flex flex-col gap-5 relative overflow-hidden">
                                <h2 className="text-2xl font-bold text-preto-texto-principal">Capacidade</h2>
                                <div className="flex flex-col gap-4 mt-2">
                                    <CheckBox id="1-pessoa" label="1 Pessoa" checked={capacidade === '1-pessoa'} onChange={() => setCapacidade('1-pessoa')} />
                                    <CheckBox id="2-pessoas" label="2 Pessoas" checked={capacidade === '2-pessoas'} onChange={() => setCapacidade('2-pessoas')} />
                                    <CheckBox id="3-pessoas" label="3+ Pessoas" checked={capacidade === '3-pessoas'} onChange={() => setCapacidade('3-pessoas')} />
                                </div>
                            </section>
                        </div>

                        {/* Comodidades e Detalhes */}
                        <section>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm flex flex-col gap-5">
                                    <h2 className="text-2xl font-bold text-preto-texto-principal">Comodidades</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-1">
                                        <CheckBox id="wifi" label="Wi-Fi" checked={comodidades.wifi} onChange={() => handleComodidadeChange('wifi')} />
                                        <CheckBox id="lavar" label="Máquina de Lavar" checked={comodidades.lavar} onChange={() => handleComodidadeChange('lavar')} />
                                        <CheckBox id="ar" label="Ar-Condicionado" checked={comodidades.ar} onChange={() => handleComodidadeChange('ar')} />
                                        <CheckBox id="churras" label="Churrascaria" checked={comodidades.churras} onChange={() => handleComodidadeChange('churras')} />
                                        <CheckBox id="vaga" label="Estacionamento" checked={comodidades.vaga} onChange={() => handleComodidadeChange('vaga')} />
                                        <CheckBox id="elevador" label="Elevador" checked={comodidades.elevador} onChange={() => handleComodidadeChange('elevador')} />
                                        <CheckBox id="piscina" label="Piscina" checked={comodidades.piscina} onChange={() => handleComodidadeChange('piscina')} />
                                        <CheckBox id="portaria" label="Portaria 24h" checked={comodidades.portaria} onChange={() => handleComodidadeChange('portaria')} />
                                        <CheckBox id="tv" label="TV" checked={comodidades.tv} onChange={() => handleComodidadeChange('tv')} />
                                    </div>
                                </section>

                                <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm flex flex-col gap-5">
                                    <h2 className="text-2xl font-bold text-preto-texto-principal">Detalhes do Imóvel</h2>
                                    <div className="flex flex-col gap-3 mt-1">
                                        <CheckBox id="centro" label="Próximo ao Centro" checked={detalhes.centro} onChange={() => handleDetalheChange('centro')} />
                                        <CheckBox id="praia" label="Próximo à Praia" checked={detalhes.praia} onChange={() => handleDetalheChange('praia')} />
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <Stepper label="Quartos" value={quartos} onIncrease={() => setQuartos(quartos + 1)} onDecrease={() => quartos > 0 && setQuartos(quartos - 1)} />
                                        <Stepper label="Banheiros" value={banheiros} onIncrease={() => setBanheiros(banheiros + 1)} onDecrease={() => banheiros > 0 && setBanheiros(banheiros - 1)} />
                                        <Stepper label="Vagas" value={vagas} onIncrease={() => setVagas(vagas + 1)} onDecrease={() => vagas > 0 && setVagas(vagas - 1)} />
                                    </div>
                                </section>
                            </div>
                        </section>

                        {/* Preferências / Regras */}
                        <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm flex flex-col gap-5 w-full">
                            <h2 className="text-2xl font-bold text-preto-texto-principal">Preferência / Regras</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mt-1">
                                <div className="flex flex-col gap-3">
                                    <CheckBox id="pets" label="Aceita Pets" checked={detalhes.pets} onChange={() => handleDetalheChange('pets')} />
                                    <CheckBox id="festas" label="Permite Festas" checked={detalhes.festas} onChange={() => handleDetalheChange('festas')} />
                                    <CheckBox id="acessibilidade" label="Acessibilidade" checked={detalhes.acessibilidade} onChange={() => handleDetalheChange('acessibilidade')} />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <CheckBox id="fumante" label="Não Fumante" checked={detalhes.fumante} onChange={() => handleDetalheChange('fumante')} />
                                </div>
                            </div>
                        </section>

                        {/* Fotos do Imóvel */}
                        <section>
                            <div className="w-full flex flex-col gap-6">
                                <section className="border border-borda-cards bg-fundo-cards rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold text-preto-texto-principal mb-5">Fotos do Imóvel</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="border-2 border-dashed border-gray-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50/50 transition-colors bg-white min-h-[200px]">
                                            <input type="file" multiple accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange} />
                                            <svg className="w-12 h-12 text-black mb-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                            </svg>
                                            <span className="font-bold text-lg text-preto-texto-principal block">Clique para Enviar Fotos</span>
                                            <span className="text-xs text-cinza-texto-secundario mt-1 block">Ou arraste e solte aqui <br /> Formatos aceitos: JPG, PNG</span>
                                        </label>

                                        <div className="grid grid-cols-2 gap-3">
                                            {[...Array(4)].map((_, index) => {
                                                const imagemAtual = imagens[index];
                                                
                                                const imgSrc = imagemAtual instanceof File 
                                                    ? URL.createObjectURL(imagemAtual) 
                                                    : (imagemAtual?.path ? `http://localhost:5000${imagemAtual.path}` : '');

                                                return (
                                                    <div key={index} className="bg-[#D9D9D9]/60 border border-borda-cards rounded-2xl flex items-center justify-center min-h-[96px] overflow-hidden relative group">
                                                        {imgSrc ? (
                                                            <img src={imgSrc} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                            </svg>
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