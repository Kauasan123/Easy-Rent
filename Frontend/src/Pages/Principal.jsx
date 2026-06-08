import { useState, useEffect } from 'react'
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import CheckBox from '../components/CheckBox.jsx';
import Stepper from '../components/Stepper.jsx';
import Calendario from '../components/Calendario.jsx';
import CardsImoveis from '../components/CardsImoveis.jsx';
import ModalAluguel from './ModalAluguel.jsx'
import Hero from '../assets/TelaPrincipal/MiniHero.jpg';
import * as Icons from '../icons/icons.js';
import * as Slider from '@radix-ui/react-slider';

// Função StarRating (mantida igual)
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(null);
  return (
    <div className="flex items-center gap-4">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <div key={index} className="relative flex cursor-pointer">
            <div className="w-2.5 h-5 z-10" onMouseEnter={() => setHover(starValue - 0.5)} onMouseLeave={() => setHover(null)} onClick={() => onChange(starValue - 0.5)} />
            <div className="w-2.5 h-5 z-10" onMouseEnter={() => setHover(starValue)} onMouseLeave={() => setHover(null)} onClick={() => onChange(starValue)} />
            <div className="absolute inset-0">
              {(hover || value) >= starValue ? (
                <Icons.FaStar className="text-icone-estrela" size={30} />
              ) : (hover || value) >= starValue - 0.5 ? (
                <Icons.FaStarHalfAlt className="text-icone-estrela" size={30} />
              ) : (
                <Icons.FaRegStar className="text-zinc-300" size={30} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Principal() {
  const [imovelSelecionado, setImovelSelecionado] = useState(null);
  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [localizacaoAberta, setLocalizacaoAberta] = useState(false);
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [rating, setRating] = useState(0);
  const [quartos, setQuartos] = useState(1);
  const [banheiros, setBanheiros] = useState(1);
  const [vagas, setVagas] = useState(1);
  const [range, setRange] = useState([0, 10000]);
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('');

  // Estados do banco
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const itensPorPagina = 12;

  // Estados para filtros
  const [tiposImovel, setTiposImovel] = useState([]);
  const [capacidades, setCapacidades] = useState([]);
  const [comodidades, setComodidades] = useState([]);
  const [detalhes, setDetalhes] = useState([]);
  const [regras, setRegras] = useState([]);
  const [localizacao, setLocalizacao] = useState('');

  // Busca os imóveis do banco
  useEffect(() => {
    const carregarImoveis = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/imoveis');
        const data = await response.json();
        setImoveis(data);
      } catch (error) {
        console.error("Erro ao carregar imóveis:", error);
      } finally {
        setCarregando(false);
      }
    };
    carregarImoveis();
  }, []);

  // Filtragem
  const imoveisFiltrados = imoveis
    .filter(imovel => {
      const precoNumerico = parseFloat(imovel.preco) || 0;
      return precoNumerico >= range[0] && precoNumerico <= range[1];
    })
    .filter(imovel => {
      if (!busca) return true;
      const termo = busca.toLowerCase();
      return (
        imovel.titulo?.toLowerCase().includes(termo) ||
        imovel.cidade?.toLowerCase().includes(termo) ||
        imovel.bairro?.toLowerCase().includes(termo) ||
        imovel.endereco?.toLowerCase().includes(termo)
      );
    })
    .filter(imovel => {
      if (!localizacao) return true;
      const termo = localizacao.toLowerCase();
      return (
        imovel.cidade?.toLowerCase().includes(termo) ||
        imovel.bairro?.toLowerCase().includes(termo)
      );
    })
    .filter(imovel => {
      if (tiposImovel.length === 0) return true;
      return tiposImovel.includes(imovel.tipo);
    })
    .filter(imovel => {
      if (capacidades.length === 0) return true;
      return capacidades.includes(imovel.capacidade);
    })
    .filter(imovel => {
      if (comodidades.length === 0) return true;
      return comodidades.every(c => imovel[c] === true);
    })
    .filter(imovel => {
      if (detalhes.length === 0) return true;
      return detalhes.every(d => imovel[d] === true);
    })
    .filter(imovel => {
      if (regras.length === 0) return true;
      return regras.every(r => imovel[r] === true);
    })
    .filter(imovel => {
      if (quartos <= 1) return true;
      return imovel.quartos >= quartos;
    })
    .filter(imovel => {
      if (banheiros <= 1) return true;
      return imovel.banheiros >= banheiros;
    })
    .filter(imovel => {
      if (vagas <= 1) return true;
      return imovel.vagas >= vagas;
    })
    .sort((a, b) => {
      if (ordenacao === 'menor') return parseFloat(a.preco) - parseFloat(b.preco);
      if (ordenacao === 'maior') return parseFloat(b.preco) - parseFloat(a.preco);
      return 0;
    });

  const toggleFiltro = (lista, setLista, valor) => {
    setLista(prev =>
      prev.includes(valor) ? prev.filter(v => v !== valor) : [...prev, valor]
    );
    setPaginaAtual(1);
  };

  // Paginação
  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const imoveisExibidos = imoveisFiltrados.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(imoveisFiltrados.length / itensPorPagina);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white">
        <header><Header /></header>

        <main className="min-h-[80vh] flex flex-col justify-between">
          {/* Mini Hero */}
          <section>
            <div className="relative w-full h-72 overflow-hidden rounded-xl p-10 pt-5">
              <div className="relative w-full h-full">
                <img src={Hero} alt="Mini Hero" className="w-full h-full object-cover rounded-lg" />
                <div className='absolute inset-0 flex items-center justify-center px-12'>
                  <div className='flex items-center justify-between w-full max-w-6xl mx-auto gap-8'>
                    <div className='max-w-[60%]'>
                      <h2 className='text-3xl lg:text-5xl text-preto-principal drop-shadow-lg tracking-tight leading-tight'>
                        Gostaria de Colocar seu espaço <br className="hidden lg:block" />
                        <span className='text-beje-principal font-bold'>para alugar?</span>
                      </h2>
                    </div>
                    <div className='shrink-0'>
                      <a href="/aluguel" className='hover:bg-botao-beje-apertado bg-beje-principal text-branco-texto-principal border-preto-principal border-2 rounded-lg text-xl md:text-3xl py-4 px-10 cursor-pointer active:scale-95 transition-all whitespace-nowrap inline-block font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
                        Clique Aqui
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Conteúdo Principal */}
          <section className="container-principal flex w-full max-w-[1440px] 2xl:max-w-[1700px] mx-auto gap-6 p-6">

            {/* Filtro */}
            <aside className="w-[300px] border border-borda-cards rounded-2xl p-4 bg-fundo-cards flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Filtro</h2>
              </div>

              {/* Localização */}
              <div className="border border-borda-cards rounded-xl overflow-hidden bg-fundo-cards">
                <button onClick={() => setLocalizacaoAberta(!localizacaoAberta)} className="w-full flex items-center justify-between p-3 transition-colors hover:bg-zinc-50">
                  <div className="flex items-center gap-2 font-bold text-sm text-preto-texto-principal">
                    <Icons.FaLocationDot size={18} /> Localização
                  </div>
                  <Icons.IoIosArrowDown className={`transition-transform duration-300 ${localizacaoAberta ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${localizacaoAberta ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-3 pb-3 pt-0">
                    <input
                      type="text"
                      placeholder="Escreva aonde deseja procurar..."
                      value={localizacao}
                      onChange={(e) => { setLocalizacao(e.target.value); setPaginaAtual(1); }}
                      className="w-full p-2 border border-borda-cards rounded-lg text-sm outline-none focus:border-beje-principal bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Preço */}
              <div className="flex flex-col gap-3 p-3 border border-borda-cards rounded-xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 font-bold">
                    <Icons.FaMoneyBill1Wave size={18} /> Preço
                  </div>
                  <button onClick={() => setRange([0, 10000])} className="text-vermelho-cancelar text-xs font-bold hover:underline flex flex-row text-center items-center">
                    <Icons.IoIosClose className='text-vermelho-cancelar' size={24} />Limpar
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-full">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400">R$</span>
                    <input type="number" value={range[0]} onChange={(e) => setRange([Number(e.target.value), range[1]])} className="w-full p-2 pl-6 border rounded-lg text-xs text-center outline-none focus:border-beje-principal" />
                  </div>
                  <span>-</span>
                  <div className="relative w-full">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400">R$</span>
                    <input type="number" value={range[1]} onChange={(e) => setRange([range[0], Number(e.target.value)])} className="w-full p-2 pl-6 border rounded-lg text-xs text-center outline-none focus:border-beje-principal" />
                  </div>
                </div>
                <Slider.Root className="relative flex items-center select-none touch-none w-full h-5" max={10000} step={100} value={range} onValueChange={setRange}>
                  <Slider.Track className="bg-cinza-slider relative grow rounded-full h-1.5">
                    <Slider.Range className="absolute bg-beje-principal rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 border-white border-2 bg-beje-principal shadow-md rounded-full hover:scale-110 transition-transform cursor-grab active:cursor-grabbing outline-none" />
                  <Slider.Thumb className="block w-5 h-5 border-white border-2 bg-beje-principal shadow-md rounded-full hover:scale-110 transition-transform cursor-grab active:cursor-grabbing outline-none" />
                </Slider.Root>
              </div>

              {/* Data */}
              <div className="border border-borda-cards rounded-xl overflow-hidden bg-fundo-cards">
                <button onClick={() => setCalendarioAberto(!calendarioAberto)} className="w-full flex items-center justify-between p-3 transition-colors hover:bg-zinc-50">
                  <div className="flex items-center gap-2 font-bold text-sm text-preto-texto-principal">
                    <Icons.FaCalendarAlt size={18} /> Selecionar Datas
                  </div>
                  <Icons.IoIosArrowDown className={`transition-transform duration-300 ${calendarioAberto ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${calendarioAberto ? 'max-h-[500px] opacity-100 border-t border-zinc-100' : 'max-h-0 opacity-0 invisible'}`}>
                  <div className="p-3">
                    <Calendario startDate={dataInicio} endDate={dataFim} setStartDate={setDataInicio} setEndDate={setDataFim} />
                  </div>
                </div>
              </div>

              {/* Tipo de Imóvel */}
              <div className="flex flex-col gap-3 p-3 border border-borda-cards rounded-xl">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.FaHouseChimney size={18} /> Tipo do Imóvel
                </div>
                <CheckBox label="Casa" id="tipo-casa" checked={tiposImovel.includes('casa')} onChange={() => toggleFiltro(tiposImovel, setTiposImovel, 'casa')} />
                <CheckBox label="Apartamento" id="tipo-apto" checked={tiposImovel.includes('apartamento')} onChange={() => toggleFiltro(tiposImovel, setTiposImovel, 'apartamento')} />
              </div>

              {/* Capacidade */}
              <div className="flex flex-col gap-2 p-3 border border-borda-cards rounded-xl">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.IoPeopleSharp size={18} /> Capacidade
                </div>
                <CheckBox label="1 Pessoa" id="cap-1" checked={capacidades.includes('1 Pessoa')} onChange={() => toggleFiltro(capacidades, setCapacidades, '1 Pessoa')} />
                <CheckBox label="2 Pessoas" id="cap-2" checked={capacidades.includes('2 Pessoas')} onChange={() => toggleFiltro(capacidades, setCapacidades, '2 Pessoas')} />
                <CheckBox label="3+ Pessoas" id="cap-3" checked={capacidades.includes('3+ Pessoas')} onChange={() => toggleFiltro(capacidades, setCapacidades, '3+ Pessoas')} />
              </div>

              {/* Avaliação */}
              <div className="flex flex-col gap-2 p-3 border border-borda-cards rounded-xl">
                <div className='flex flex-row justify-between'>
                  <div className="flex items-center gap-2 font-bold">
                    <Icons.FaStar size={18} /> Avaliação
                  </div>
                  <button onClick={() => setRating(0)} className="text-vermelho-cancelar text-xs font-bold hover:underline flex flex-row text-center items-center">
                    <Icons.IoIosClose className='text-vermelho-cancelar' size={24} />Limpar
                  </button>
                </div>
                <div className='flex items-center justify-start pl-0.5 pb-2'>
                  <StarRating value={rating} onChange={(val) => setRating(val)} />
                </div>
              </div>

              {/* Comodidades */}
              <div className="flex flex-col gap-2 p-3 border border-borda-cards rounded-xl">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.TbStarsFilled size={18} /> Comodidades
                </div>
                <CheckBox label="Wi-Fi" id="com-wifi" checked={comodidades.includes('hasWifi')} onChange={() => toggleFiltro(comodidades, setComodidades, 'hasWifi')} />
                <CheckBox label="Ar-condicionado" id="com-ar" checked={comodidades.includes('hasArCondicionado')} onChange={() => toggleFiltro(comodidades, setComodidades, 'hasArCondicionado')} />
                <CheckBox label="Estacionamento" id="com-est" checked={comodidades.includes('hasEstacionamento')} onChange={() => toggleFiltro(comodidades, setComodidades, 'hasEstacionamento')} />
                <CheckBox label="Piscina" id="com-pisc" checked={comodidades.includes('hasPiscina')} onChange={() => toggleFiltro(comodidades, setComodidades, 'hasPiscina')} />
                <CheckBox label="TV" id="com-tv" checked={comodidades.includes('hasTv')} onChange={() => toggleFiltro(comodidades, setComodidades, 'hasTv')} />
                <CheckBox label="Máquina de Lavar" id="com-lavar" checked={comodidades.includes('hasMaquinaLavar')} onChange={() => toggleFiltro(comodidades, setComodidades, 'hasMaquinaLavar')} />
                <CheckBox label="Churrascaria" id="com-churras" checked={comodidades.includes('hasChurrascaria')} onChange={() => toggleFiltro(comodidades, setComodidades, 'hasChurrascaria')} />
                <CheckBox label="Elevador" id="com-elev" checked={comodidades.includes('hasElevador')} onChange={() => toggleFiltro(comodidades, setComodidades, 'hasElevador')} />
                <CheckBox label="Portaria 24h" id="com-port" checked={comodidades.includes('hasPortaria24h')} onChange={() => toggleFiltro(comodidades, setComodidades, 'hasPortaria24h')} />

                <div className="flex items-center gap-2 font-bold text-sm mt-3">
                  <Icons.FaClipboardList size={18} /> Detalhes do Imóvel
                </div>
                <CheckBox label="Próximo ao Centro" id="det-centro" checked={detalhes.includes('proximoCentro')} onChange={() => toggleFiltro(detalhes, setDetalhes, 'proximoCentro')} />
                <CheckBox label="Próximo à Praia" id="det-praia" checked={detalhes.includes('proximoPraia')} onChange={() => toggleFiltro(detalhes, setDetalhes, 'proximoPraia')} />

                <div>
                  <Stepper label="Quartos" value={quartos} onIncrease={() => setQuartos(quartos + 1)} onDecrease={() => quartos > 1 && setQuartos(quartos - 1)} />
                  <Stepper label="Banheiros" value={banheiros} onIncrease={() => setBanheiros(banheiros + 1)} onDecrease={() => banheiros > 1 && setBanheiros(banheiros - 1)} />
                  <Stepper label="Vagas" value={vagas} onIncrease={() => setVagas(vagas + 1)} onDecrease={() => vagas > 1 && setVagas(vagas - 1)} />
                </div>

                <div className="flex items-center gap-2 font-bold text-sm mt-3">
                  <Icons.FaGear size={18} /> Preferências/Regras
                </div>
                <CheckBox label="Aceita Pets" id="reg-pets" checked={regras.includes('aceitaPets')} onChange={() => toggleFiltro(regras, setRegras, 'aceitaPets')} />
                <CheckBox label="Permite Festas" id="reg-festas" checked={regras.includes('permiteFestas')} onChange={() => toggleFiltro(regras, setRegras, 'permiteFestas')} />
                <CheckBox label="Acessibilidade" id="reg-acess" checked={regras.includes('acessibilidade')} onChange={() => toggleFiltro(regras, setRegras, 'acessibilidade')} />
                <CheckBox label="Não Fumante" id="reg-fumante" checked={regras.includes('naoFumante')} onChange={() => toggleFiltro(regras, setRegras, 'naoFumante')} />
              </div>
            </aside>

            {/* Conteúdo Principal */}
            <main className="conteudo-principal flex-1 flex flex-col gap-8">
              {/* Barra de Busca */}
              <div className="w-full flex justify-center py-6">
                <div className="flex items-center w-full max-w-[800px] 2xl:max-w-[1100px] h-12 bg-white border border-preto-principal/50 rounded-xl overflow-hidden transition-colors">
                  <div className="relative h-full border-r border-preto-principal/50">
                    <select
                      value={ordenacao}
                      onChange={(e) => setOrdenacao(e.target.value)}
                      className="h-full pl-4 pr-8 bg-transparent text-sm font-medium text-preto-texto-principal outline-none appearance-none cursor-pointer hover:bg-zinc-50"
                    >
                      <option value="">Ordenar Por</option>
                      <option value="menor">Menor Preço</option>
                      <option value="maior">Maior Preço</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-800">
                      <Icons.LuChevronDown size={18} />
                    </div>
                  </div>
                  <div className="pl-4 text-zinc-500">
                    <Icons.IoIosSearch size={22} />
                  </div>
                  <input
                    type="text"
                    placeholder="Pesquisar por título, cidade ou bairro..."
                    value={busca}
                    onChange={(e) => { setBusca(e.target.value); setPaginaAtual(1); }}
                    className="flex-1 h-full px-3 text-base text-preto-texto-principal/50 outline-none placeholder:text-preto-texto-principal/50 bg-transparent"
                  />
                  <button onClick={() => setBusca('')} className="pr-4 text-preto-texto-principal hover:text-preto-texto-principal transition-colors active:scale-90">
                    <Icons.IoIosClose size={22} />
                  </button>
                </div>
              </div>

              {/* Grid de Imóveis */}
              {carregando ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-cinza-texto-secundario font-semibold">Carregando imóveis...</p>
                </div>
              ) : imoveisExibidos.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-cinza-texto-secundario font-semibold">Nenhum imóvel encontrado.</p>
                </div>
              ) : (
                <article className="grid-de-imoveis grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-3 2xl:gap-x-6 gap-y-10">
                  {imoveisExibidos.map((imovel) => (
                    <div key={imovel.id} onClick={() => setImovelSelecionado(imovel)} className="cursor-pointer">
                      <CardsImoveis
                        imovel={imovel}
                        dataSelecionada={dataInicio}
                        dataFim={dataFim}
                      />
                    </div>
                  ))}
                </article>
              )}

              {/* Modal */}
              {imovelSelecionado && (
                <ModalAluguel imovel={imovelSelecionado} onClose={() => setImovelSelecionado(null)} />
              )}

              {/* Paginação */}
              <div className="mt-auto py-12 flex items-center justify-center gap-4 select-none">
                <button onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))} disabled={paginaAtual === 1} className="flex items-center gap-1 text-cinza-texto-secundario hover:text-preto-principal transition-colors text-sm font-medium group disabled:opacity-30 disabled:cursor-not-allowed">
                  <Icons.IoIosArrowBack size={16} className="transition-transform group-hover:-translate-x-1" />
                  Anterior
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => {
                    if (numero === 1 || numero === totalPaginas || (numero >= paginaAtual - 1 && numero <= paginaAtual + 1)) {
                      return (
                        <button key={numero} onClick={() => setPaginaAtual(numero)} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors ${paginaAtual === numero ? 'bg-beje-principal text-white font-bold shadow-sm' : 'border border-borda-cards text-preto-principal font-medium hover:bg-fundo-cards'}`}>
                          {numero}
                        </button>
                      );
                    }
                    if (numero === paginaAtual + 2 || numero === paginaAtual - 2) {
                      return <div key={numero} className="w-8 h-8 flex items-center justify-center border border-borda-cards text-cinza-texto-secundario rounded-md text-sm italic">...</div>;
                    }
                    return null;
                  })}
                </div>
                <button onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaAtual === totalPaginas} className="flex items-center gap-1 text-preto-principal hover:text-beje-principal transition-colors text-sm font-medium group disabled:opacity-30 disabled:cursor-not-allowed">
                  Próximo
                  <Icons.IoIosArrowForward size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </main>
          </section>
        </main>

        <footer><Footer /></footer>
      </div>
    </>
  );
}