import React from 'react';
import * as Icons from '../icons/icons.js';

export function ModalDetalhes({ imovel, onClose }) {
  if (!imovel) return null;

  const imagemPrincipal = imovel.imagens?.[0] || imovel.imagem;
  const imagensExtras = imovel.imagens?.slice(1, 4) || [];

  // Controlar Indice de Avaliação
  const [indiceAvaliacao, setIndiceAvaliacao] = React.useState(0);

  // Lista de avaliações
  const todasAvaliacoes = [
    {
      id: 1,
      nome: "João Pedro",
      data: "24/02/2025",
      comentario: "A casa é excelente! Muito confortável e bem equipada. Voltarei com certeza",
      foto: "https://i.pravatar.cc/150?u=joao",
      nota: "5,0"
    },
    {
      id: 2,
      nome: "Mariana Santos",
      data: "10/03/2025",
      comentario: "Anfitriã muito atenciosa, casa linda e localização ótima!",
      foto: "https://i.pravatar.cc/150?u=mari",
      nota: "5,0"
    },
    {
      id: 3,
      nome: "Lucas Silva",
      data: "18/03/2025",
      comentario: "Tudo perfeito! piscina, churrasqueira que fizeram a diferença.",
      foto: "https://i.pravatar.cc/150?u=lucas",
      nota: "5,0"
    },
    {
      id: 4,
      nome: "Ana Clara",
      data: "20/03/2025",
      comentario: "Experiência incrível, o lugar é exatamente como nas fotos.",
      foto: "https://i.pravatar.cc/150?u=ana",
      nota: "5,0"
    },
  ];

  const proximaAvaliacao = () => {
    if (indiceAvaliacao + 3 < todasAvaliacoes.length) {
      setIndiceAvaliacao(indiceAvaliacao + 1);
    }
  };

  const anteriorAvaliacao = () => {
    if (indiceAvaliacao > 0) {
      setIndiceAvaliacao(indiceAvaliacao - 1);
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-preto-principal/60 backdrop-blur-sm p-4 overflow-hidden">
        <div className="bg-white w-full max-w-[1150px] h-[95vh] rounded-3xl relative overflow-y-auto p-6 md:p-10 shadow-2xl">

          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-preto-texto-principal hover:bg-cinza-fundo-x rounded-full transition-all z-[100]">
            <Icons.IoIosClose size={32} />
          </button>

          <header className="mb-6">
            <h1 className="text-3xl font-bold text-preto-texto-principal">{imovel.titulo}</h1>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-cinza-texto-secundario text-sm">
                <Icons.FaLocationDot className="text-preto-texto-principal" />
                <span>{imovel.subtitulo}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <Icons.FaStar className="text-icone-estrela" />
                <span>
                  {imovel.nota} ({todasAvaliacoes.length} Avaliações)
                </span>
              </div>
            </div>
          </header>

          {/* Conteudo Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Coluna da Esquerda (Fotos e Infos) */}
            <div className="lg:col-span-8 flex flex-col justify-between gap-8 h-full">

              {/* Fotos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[500px] overflow-hidden rounded-2xl">
                <div className="h-full overflow-hidden">
                  <img src={imagemPrincipal} className="w-full h-full object-cover hover:scale-105 transition-all duration-500" />
                </div>
                <div className="grid grid-rows-2 gap-2 h-full">
                  <div className="grid grid-cols-2 gap-2 h-full">
                    {imagensExtras.slice(0, 2).map((img, i) => (
                      <img key={i} src={img} className="w-full h-full object-cover" />
                    ))}
                  </div>
                  <div className="h-full overflow-hidden">
                    <img src={imagensExtras[2]} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Barra de Atributos (Capacidade, Quartos, etc) */}
              <div className="p-8 bg-fundo-cards rounded-2xl flex justify-between items-center border border-borda-cards">
                <div className="flex flex-col items-center gap-1 font-bold text-preto-texto-principal">
                  <Icons.IoPeopleSharp size={28} />
                  <span className="text-xs uppercase tracking-tighter">5 Capacidade</span>
                </div>
                <div className="flex flex-col items-center gap-1 font-bold text-preto-texto-principal">
                  <Icons.IoIosBed size={28} />
                  <span className="text-xs uppercase tracking-tighter">2 Quartos</span>
                </div>
                <div className="flex flex-col items-center gap-1 font-bold text-preto-texto-principal">
                  <Icons.FaCar size={26} />
                  <span className="text-xs uppercase tracking-tighter">2 Vagas</span>
                </div>
                <div className="flex flex-col items-center gap-1 font-bold text-preto-texto-principal">
                  <Icons.PiBathtubFill size={28} />
                  <span className="text-xs uppercase tracking-tighter">2 Banheiros</span>
                </div>
              </div>
            </div>

            {/* Coluna da Direita (Sidebar de Reserva) */}
            <aside className="lg:col-span-4 flex flex-col gap-6">
              <div className="top-0 border border-borda-cards rounded-3xl p-6 flex flex-col gap-4 bg-fundo-cards">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">R$ {imovel.preco}</span>
                  <span className="text-cinza-texto-secundario text-sm">/ Noite</span>
                </div>

                <div className="grid grid-cols-2 border border-borda-cards rounded-xl overflow-hidden">
                  <div className="p-3 border-r border-borda-cards flex flex-col bg-white cursor-pointer">
                    <span className="text-[10px] font-bold uppercase text-preto-texto-principal">Check-in</span>
                    <span className="text-cinza-texto-secundario text-[11px] flex items-center gap-1 mt-1 font-medium">
                      <Icons.FaCalendarAlt size={12} /> Adicionar Data
                    </span>
                  </div>
                  <div className="p-3 flex flex-col bg-white cursor-pointer">
                    <span className="text-[10px] font-bold uppercase text-preto-texto-principal">Check-out</span>
                    <span className="text-cinza-texto-secundario text-[11px] flex items-center gap-1 mt-1 font-medium">
                      <Icons.FaCalendarAlt size={12} /> Adicionar Data
                    </span>
                  </div>
                </div>

                <div className="border border-borda-cards rounded-xl p-3 flex flex-col bg-white cursor-pointer">
                  <span className="text-[10px] font-bold uppercase text-preto-texto-principal">Hóspede</span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm font-medium">2 Hóspedes</span>
                    <Icons.IoIosArrowDown size={14} />
                  </div>
                </div>

                <button className="w-full bg-beje-principal text-branco-texto-principal font-bold py-4 rounded-xl hover:bg-botao-beje-apertado transition-all active:scale-95 shadow-lg shadow-beje-principal/20">
                  Enviar disponibilidade
                </button>

                <p className="text-center text-[11px] text-cinza-texto-secundario font-medium">Você ainda não será cobrado</p>

                <div className="mt-2 p-4 border border-borda-cards rounded-2xl flex flex-col gap-3 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <img src="https://i.pravatar.cc/150?u=camila" alt="Anfitrião" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-preto-texto-principal">Anfitrião: Camila Duarte</span>
                      <span className="text-[10px] text-cinza-texto-secundario font-bold uppercase tracking-tight">Membro desde 2024</span>
                    </div>
                  </div>
                  <button className="w-full border border-beje-principal text-beje-principal text-[11px] font-bold py-2.5 rounded-lg hover:bg-botao-beje-apertado hover:text-branco-texto-principal transition-all">
                    Enviar Mensagem
                  </button>
                </div>
              </div>

              <div className="border border-borda-cards rounded-3xl p-6 bg-fundo-cards flex flex-col gap-2">
                <h3 className="font-bold text-preto-texto-principal text-lg">Localização</h3>

                <div className="flex flex-col gap-1">
                  <span className="font-bold text-sm text-preto-texto-principal">
                    {imovel.subtitulo}
                  </span>
                  <p className="text-cinza-texto-secundario text-xs leading-relaxed">
                    Próximo a praia e com acesso ao Centro da cidade.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {/* Seção Sobre o Lugar (que você já fez) */}
          <div className='pt-10'>
            <h2 className='text-preto-texto-principal text-2xl font-semibold mb-4'>
              Sobre o lugar
            </h2>
            <div className="flex flex-col gap-4">
              <p className='text-preto-texto-principal max-w-prose leading-relaxed'>
                Casa ampla e confortável no Laranjal, ideal para familias e grupos.
                Possui piscina privativa, churrasqueira, Wi-Fi, Ar-condicionado e estacionamento
                proximo a praia e ao centro.
              </p>
              <p className='text-preto-texto-principal'>
                Perfeita para relaxar e aproveitar bons momentos!
              </p>
            </div>
          </div>

          {/* Grid de Comodidades e Regras */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

            {/* Card Comodidades */}
            <div className="bg-fundo-cards border border-borda-cards rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Comodidades</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.FaWifi className="text-beje-principal" /> <span>Wi-Fi</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.LuWashingMachine className="text-beje-principal" /> <span>Máquina de Lavar</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.LuWind className="text-beje-principal" /> <span>Ar-Condicionado</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.MdOutlineOutdoorGrill className="text-beje-principal" size={18} /> <span>Churrascaria</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.FaCar className="text-beje-principal" /> <span>Estacionamento</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.PiElevator className="text-beje-principal" size={18} /> <span>Elevador</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.FaSwimmingPool className="text-beje-principal" /> <span>Piscina</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.MdOutlineShieldMoon className="text-beje-principal" /> <span>Portaria 24h</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.FaTv className="text-beje-principal" /> <span>TV</span>
                </div>
              </div>
            </div>

            {/* Card Regras da Casa */}
            <div className="bg-fundo-cards border border-borda-cards rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Regras da Casa</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.FaDog className="text-beje-principal" /> <span>Aceita Pets</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.BiParty className="text-beje-principal" /> <span>Permite Festas</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.FaWheelchair className="text-beje-principal" /> <span>Acessibilidade</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Icons.FaBanSmoking className="text-beje-principal" /> <span>Não Fumante</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Avaliação */}
          <div className="pt-10 border-borda-cards">

            {/* Header com Nota Geral e Setas */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-preto-texto-principal">Avaliação de Hóspedes</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-3xl font-bold text-preto-texto-principal">4,9</span>
                  <div className="flex items-center text-icone-estrela">
                    <Icons.FaStar size={20} />
                    <Icons.FaStar size={20} />
                    <Icons.FaStar size={20} />
                    <Icons.FaStar size={20} />
                    <Icons.FaStarHalfAlt size={20} />
                  </div>
                  <span className="text-cinza-texto-secundario text-sm font-medium">(24 Avaliações)</span>
                </div>
              </div>

              {/* Navegação Conectada às funções anterior/proximo */}
              <div className="flex gap-2">
                <button onClick={anteriorAvaliacao} disabled={indiceAvaliacao === 0} className={`p-2.5 rounded-full transition-all border border-transparent hover:border-borda-cards ${indiceAvaliacao === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-cinza-fundo-x'}`}>
                  <Icons.IoIosArrowBack size={24} className="text-cinza-texto-secundario" />
                </button>
                <button onClick={proximaAvaliacao} disabled={indiceAvaliacao + 3 >= todasAvaliacoes.length} className={`p-2.5 rounded-full transition-all border border-transparent hover:border-borda-cards ${indiceAvaliacao + 3 >= todasAvaliacoes.length ? 'opacity-30 cursor-not-allowed' : 'hover:bg-cinza-fundo-x'}`}>
                  <Icons.IoIosArrowForward size={24} className="text-preto-texto-principal" />
                </button>
              </div>
            </div>

            {/* Grid de Avaliações */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todasAvaliacoes.slice(indiceAvaliacao, indiceAvaliacao + 3).map((feedback) => (
                <div key={feedback.id} className="border border-borda-cards rounded-2xl p-6 flex flex-col justify-between min-h-[200px] bg-white hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-100">
                        <img src={feedback.foto} className="w-full h-full object-cover" alt={feedback.nome} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-preto-texto-principal">{feedback.nome}</span>
                        <span className="text-cinza-texto-secundario text-xs font-medium">{feedback.data}</span>
                      </div>
                    </div>

                    {/* Texto da Avaliação */}
                    <p className="text-sm text-preto-texto-principal leading-relaxed line-clamp-3">
                      {feedback.comentario}
                    </p>
                  </div>

                  {/* Nota */}
                  <div className="flex items-center gap-1 mt-4 font-bold text-base text-preto-texto-principal">
                    <Icons.FaStar className="text-icone-estrela" size={20} />
                    <span>{feedback.nota}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Botão Final */}
            <div className="mt-10">
              <button className="bg-beje-principal text-branco-texto-principal font-bold px-10 py-3.5 rounded-xl hover:bg-botao-beje-apertado transition-all active:scale-95 shadow-md">
                Fazer Avaliação
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalDetalhes;