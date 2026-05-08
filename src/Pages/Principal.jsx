import { useState } from 'react'
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import CheckBox from '../components/CheckBox.jsx';
import Stepper from '../components/Stepper.jsx';
import Calendario from '../components/Calendario.jsx';
import Hero from '../assets/TelaPrincipal/MiniHero.jpg';
import * as Icons from '../icons/icons.js';
import * as Slider from '@radix-ui/react-slider';

const imoveis = [
  {
    id: 1,
    titulo: "Mansão com Vista Mar",
    subtitulo: "Exclusiva residência na beira da praia com piscina infinita e deck privativo",
    imagem: Hero,
    nota: "5,0",
    disponibilidade: "Disponível 12 - 20 Jul",
    quartos: 5,
    vagas: 4,
    preco: "4.800,00"
  },
  {
    id: 2,
    titulo: "Loft Industrial",
    subtitulo: "Estilo nova-iorquino no coração da cidade",
    imagem: Hero,
    nota: "4.9",
    disponibilidade: "Disponível agora",
    quartos: 1,
    vagas: 1,
    preco: "850,00"
  },
  {
    id: 3,
    titulo: "Chalé Suíço",
    subtitulo: "Ache o refúgio perfeito nas montanhas com lareira e vista para o vale nevado",
    imagem: Hero,
    nota: "4.7",
    disponibilidade: "Disponível 01 - 10 Ago",
    quartos: 3,
    vagas: 2,
    preco: "2.100,00"
  },
  {
    id: 4,
    titulo: "Studio Compacto",
    subtitulo: "Praticidade total para nômades digitais",
    imagem: Hero,
    nota: "4.5",
    disponibilidade: "Disponível 15 - 22 Jun",
    quartos: 1,
    vagas: 0,
    preco: "450,00"
  },
  {
    id: 5,
    titulo: "Casa de Campo",
    subtitulo: "Amplo jardim, pomar orgânico e tranquilidade absoluta para toda a família descansar",
    imagem: Hero,
    nota: "4.8",
    disponibilidade: "Disponível 05 - 12 Set",
    quartos: 4,
    vagas: 3,
    preco: "1.250,00"
  },
  {
    id: 6,
    titulo: "Penthouse Luxo",
    subtitulo: "Cobertura duplex com spa",
    imagem: Hero,
    nota: "5,0",
    disponibilidade: "Disponível 20 - 30 Dez",
    quartos: 3,
    vagas: 2,
    preco: "7.900,00"
  }
];

// 1. Mova a função StarRating para fora
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex items-center gap-4">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <div key={index} className="relative flex cursor-pointer">
            {/* Metade Esquerda */}
            <div
              className="w-2.5 h-5 z-10"
              onMouseEnter={() => setHover(starValue - 0.5)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onChange(starValue - 0.5)}
            />
            {/* Metade Direita */}
            <div
              className="w-2.5 h-5 z-10"
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onChange(starValue)}
            />
            {/* Ícones */}
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
  // Função Abrir e Fechar Cards
  const [aberto, setAberto] = useState("");

  // Função Avaliação
  const [rating, setRating] = useState(0);

  // Função Stepper
  const [quartos, setQuartos] = useState(1);
  const [banheiros, setBanheiros] = useState(1);
  const [vagas, setVagas] = useState(1);

  // Função Preço
  const [range, setRange] = useState([0, 10000]);
  const imoveisFiltro = imoveis.filter(imovel => {
    const precoLimpo = imovel.preco.replace(/\./g, '').replace(',', '.');
    const precoNumerico = parseFloat(precoLimpo);

    return precoNumerico >= range[0] && precoNumerico <= range[1];
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header>
        <Header />
      </header>

      <main className="">
        {/* Mini Hero Section */}
        <section className="">
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
                    <a href="#" className='hover:bg-botao-beje-apertado bg-beje-principal text-branco-texto-principal border-preto-principal border-2 rounded-lg text-xl md:text-3xl py-4 px-10 cursor-pointer active:scale-95 transition-all whitespace-nowrap inline-block font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
                      Clique Aqui
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Conteudo Principal */}
        <section className="container-principal flex w-full max-w-[1440px] 2xl:max-w-[1700px] mx-auto gap-6 p-6">

          {/* Filtro */}
          <aside className="w-[300px] border border-borda-cards rounded-2xl p-4 bg-fundo-cards flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Filtro</h2>
              {/* Ícone de fechar */}
            </div>

            {/* Seção Localização */}
            <div className="border border-borda-cards rounded-xl overflow-hidden">
              <button onClick={() => setAberto(aberto === 'localizacao' ? '' : 'localizacao')} className="w-full flex items-center justify-between p-3 transition-colors">
                <div className="flex items-center gap-2 font-bold">
                  <Icons.FaLocationDot size={18} /> Localização
                </div>
                <Icons.IoIosArrowDown className={`transition-transform ${aberto === 'localizacao' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${aberto === 'localizacao' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-3 pb-3 pt-0">
                  <input type="text" placeholder="Escreva aonde deseja procurar..." className="w-full p-2 border border-borda-cards rounded-lg text-sm outline-none focus:border-beje-principal bg-white" />
                </div>
              </div>
            </div>

            {/* Seção Preço */}
            <div className="flex flex-col gap-3 p-3 border border-borda-cards rounded-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold">
                  <Icons.FaMoneyBill1Wave size={18} /> Preço
                </div>
                <div>
                  <button onClick={() => setRange([0, 10000])} className="text-vermelho-cancelar text-xs font-bold hover:underline flex flex-row text-center items-center">
                    <Icons.IoIosClose className='text-vermelho-cancelar' size={24} />
                    Limpar
                  </button>
                </div>
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

              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                max={10000}
                step={100}
                value={range}
                onValueChange={setRange}
              >
                <Slider.Track className="bg-cinza-slider relative grow rounded-full h-1.5">
                  <Slider.Range className="absolute bg-beje-principal rounded-full h-full" />
                </Slider.Track>

                <Slider.Thumb className="block w-5 h-5 border-white border-2 bg-beje-principal shadow-md rounded-full hover:scale-110 transition-transform cursor-grab active:cursor-grabbing outline-none" />
                <Slider.Thumb className="block w-5 h-5 border-white border-2 bg-beje-principal shadow-md rounded-full hover:scale-110 transition-transform cursor-grab active:cursor-grabbing outline-none" />
              </Slider.Root>
            </div>

            {/* Seção Data */}
            <div className="border border-borda-cards rounded-xl overflow-hidden">
              <button onClick={() => setAberto(aberto === 'calendario' ? null : 'calendario')} className="w-full flex items-center justify-between p-3 transition-colors">
                <div className="flex items-center gap-2 font-bold">
                  <Icons.FaCalendarAlt size={18} /> Selecionar Datas
                </div>
                <Icons.IoIosArrowDown className={`transition-transform duration-300 ${aberto === 'calendario' ? 'rotate-180' : ''}`}/>
              </button>

              <div className={`transition-all duration-300 overflow-hidden ${aberto === 'calendario' ? 'max-h-[500px] opacity-100 p-3 border-t border-zinc-100' : 'max-h-0 opacity-0 invisible'}`}>
                <Calendario />
              </div>
            </div>

            {/* Seção Tipo de Imóvel */}
            <div className="flex flex-col gap-3 p-3 border border-borda-cards rounded-xl">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Icons.FaHouseChimney size={18} /> Tipo do Imóvel
              </div>

              <CheckBox label="Casa" id="casa" />
              <CheckBox label="Apartamento" id="apto" />
            </div>

            {/* Seção Capacidade */}
            <div className="flex flex-col gap-2 p-3 border border-borda-cards rounded-xl">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Icons.IoPeopleSharp size={18} /> Capacidade
              </div>

              <CheckBox label="1" id="1" />
              <CheckBox label="2" id="2" />
              <CheckBox label="+3" id="+3" />
            </div>

            {/* Seção Avaliação */}
            <div className="flex flex-col gap-2 p-3 border border-borda-cards rounded-xl">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Icons.BsStars size={18} /> Avaliação
              </div>
              <div className='flex items-center justify-start pl-0.5 pb-2'>
                <StarRating value={rating} onChange={(val) => setRating(val)} />
              </div>
            </div>

            {/* Seção Comodidades */}
            <div className="flex flex-col gap-2 p-3 border border-borda-cards rounded-xl">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Icons.TbStarsFilled size={18} /> Comodidades
              </div>
              <CheckBox label="Wifi" id="Wifi" />
              <CheckBox label="Ar-condicionado" id="Ar-condicionado" />
              <CheckBox label="Estacionamento" id="Estacionamento" />
              <CheckBox label="Piscina" id="Piscina" />
              <CheckBox label="TV" id="TV" />
              <CheckBox label="Maquina de Lavar" id="Maquina de Lavar" />
              <CheckBox label="Churrasqueira" id="Churrasqueira" />
              <CheckBox label="Elevador" id="Elevador" />
              <CheckBox label="Portaria 24h" id="Portaria 24h" />

              <div className="flex items-center gap-2 font-bold text-sm mt-3">
                <Icons.FaClipboardList size={18} /> Detalhes do Imóvel
              </div>
              <CheckBox label="Proximo ao Centro" id="Proximo ao Centro" />
              <CheckBox label="Proximo a Praia" id="Proximo a Praia" />

              <div>
                <Stepper label="Quartos" value={quartos} onIncrease={() => setQuartos(quartos + 1)} onDecrease={() => quartos > 0 && setQuartos(quartos - 1)} />
                <Stepper label="Banheiros" value={banheiros} onIncrease={() => setBanheiros(banheiros + 1)} onDecrease={() => banheiros > 0 && setBanheiros(banheiros - 1)} />
                <Stepper label="Vagas" value={vagas} onIncrease={() => setVagas(vagas + 1)} onDecrease={() => vagas > 0 && setVagas(vagas - 1)} />
              </div>

              <div className="flex items-center gap-2 font-bold text-sm mt-3">
                <Icons.FaGear size={18} /> Preferencias/Regras
              </div>
              <CheckBox label="Aceita Pets" id="Aceita Pets" />
              <CheckBox label="Permite Festas" id="Permite Festas" />
              <CheckBox label="Acessibilidade" id="Acessibilidade" />
              <CheckBox label="Não Fumante" id="Não Fumante" />
            </div>
          </aside>

          {/* Conteudo Principal */}
          <main className="conteudo-principal flex-1 flex flex-col gap-8">
            {/* Barra de Busca e Ordenação */}
            <div className="w-full flex justify-center py-6">
              <div className="flex items-center w-full max-w-[800px] 2xl:max-w-[1100px] h-12 bg-white border border-preto-principal/50 rounded-xl overflow-hidden transition-colors">
                <div className="relative h-full border-r border-preto-principal/50">
                  <select className="h-full pl-4 pr-8 bg-transparent text-sm font-medium text-preto-texto-principal outline-none appearance-none cursor-pointer hover:bg-zinc-50">
                    <option>Ordenar Por</option>
                    <option>Menor Preço</option>
                    <option>Maior Preço</option>
                    <option>Melhor Avaliados</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-800">
                    <Icons.LuChevronDown size={18} />
                  </div>
                </div>

                <div className="pl-4 text-zinc-500">
                  <Icons.IoIosSearch size={22} />
                </div>

                <input type="text" placeholder="Pesquisar..." className="flex-1 h-full px-3 text-base text-preto-texto-principal/50 outline-none placeholder:text-preto-texto-principal/50 bg-transparent" />
                <button className="pr-4 text-preto-texto-principal hover:text-preto-texto-principal transition-colors active:scale-90">
                  <Icons.IoIosClose size={22} />
                </button>
              </div>
            </div>

            {/* Grid de Imoveis */}
            <article className="grid-de-imoveis grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-3 2xl:gap-x-6 gap-y-10">
              {imoveis.map((imovel) => (
                <div key={imovel.id} className='relative border h-[380px] 2xl:h-[420px] w-full max-w-[280px] 2xl:max-w-[300px] mx-auto rounded-xl overflow-hidden shadow-sm flex flex-col'>
                  <div className='relative h-[50%] w-full overflow-hidden group'>
                    <img src={imovel.imagem} alt={imovel.titulo} className='w-full h-full object-cover transition-transform duration-300 hover:scale-110' />
                    <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <button className="bg-white/70 p-1 rounded-full hover:bg-white text-preto-texto-principal pointer-events-auto">
                        <Icons.IoIosArrowBack />
                      </button>
                      <button className="bg-white/70 p-1 rounded-full hover:bg-white text-preto-texto-principal pointer-events-auto">
                        <Icons.IoIosArrowForward />
                      </button>
                    </div>
                    <div className="absolute bottom-2 w-full flex justify-center gap-1 pointer-events-none">
                      <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-sm"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-sm"></div>
                    </div>
                  </div>

                  <div className="p-3 2xl:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className='flex flex-row items-center justify-between mb-1 gap-1'>
                        <span className="text-base 2xl:text-lg font-bold text-preto-texto-principal truncate">{imovel.titulo}</span>
                        <div className='flex flex-row items-center shrink-0'>
                          <Icons.FaStar className='text-icone-estrela' size={16} />
                          <span className='text-base 2xl:text-lg font-bold ml-1 text-preto-texto-principal'>{imovel.nota}</span>
                        </div>
                      </div>
                      <div className='leading-tight min-h-[2.5rem] 2xl:min-h-[3rem]'>
                        <p className='text-sm 2xl:text-base text-preto-texto-principal/50 line-clamp-2'>
                          {imovel.subtitulo}
                        </p>
                      </div>
                      <div>
                        <span className='text-sm 2xl:text-base text-preto-texto-principal/50'>{imovel.disponibilidade}</span>
                      </div>
                    </div>

                    <div className='flex gap-3 2xl:gap-5 my-2'>
                      <div className='flex flex-row items-center gap-1 shrink-0'>
                        <Icons.IoIosBed className='text-preto-principal' size={18} />
                        <span className='text-sm 2xl:text-base font-semibold text-preto-principal'>{imovel.quartos} Quartos</span>
                      </div>
                      <div className='flex flex-row items-center gap-1 shrink-0'>
                        <Icons.FaCar className='text-preto-principal' size={16} />
                        <span className='text-sm 2xl:text-base font-semibold text-preto-principal'>{imovel.vagas} Vagas</span>
                      </div>
                    </div>

                    <div className='flex flex-row items-center justify-between pt-1 pb-1'>
                      <div className='flex items-center shrink-0'>
                        <span className="text-lg text-beje-principal font-bold whitespace-nowrap">R$ {imovel.preco}</span>
                      </div>
                      <a href="#" className='text-beje-principal border border-beje-principal rounded-md text-[14px] py-1 px-2 2xl:py-1.5 2xl:px-4 hover:bg-botao-branco-apertado transition-all font-medium whitespace-nowrap active:scale-95'>
                        Ver Detalhes
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </article>

            {/* PARTE INFERIOR: PAGINAÇÃO */}
            <div className="paginacao w-full flex justify-center py-10">
              {/* Os números das páginas (1, 2, 3...) entram aqui */}
            </div>
          </main>
        </section >
      </main >

      <footer>
        <Footer />
      </footer>
    </div >
  )
}