import React from 'react';
import * as Icons from '../icons/icons.js';

export function ModalDetalhes({ imovel, onClose }) {
  if (!imovel) return null;

  const imagemPrincipal = imovel.imagens?.[0] || imovel.imagem;
  const imagensExtras = imovel.imagens?.slice(1, 4) || [];

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
                {/* Fazer que tenha mostre a quantidade de avialiaçãos daquele imovel */}
                <span>{imovel.nota} (24 Avaliações)</span>
              </div>
            </div>
          </header>

          {/* Conteudo Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Coluna da Esquerda (Fotos e Infos) */}
            <div className="lg:col-span-8 flex flex-col gap-8">

              {/* Fotos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[450px] overflow-hidden rounded-2xl">
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
              <div className="p-8 bg-fundo-cards rounded-2xl pl-12 pr-12 flex justify-between items-center border border-borda-cards">
                <div className="flex flex-col items-center gap-1 font-bold text-zinc-800">
                  <Icons.IoPeopleSharp size={28} />
                  <span className="text-xs uppercase tracking-tighter">5 Capacidade</span>
                </div>
                <div className="flex flex-col items-center gap-1 font-bold text-zinc-800">
                  <Icons.IoIosBed size={28} />
                  <span className="text-xs uppercase tracking-tighter">2 Quartos</span>
                </div>
                <div className="flex flex-col items-center gap-1 font-bold text-zinc-800">
                  <Icons.FaCar size={26} />
                  <span className="text-xs uppercase tracking-tighter">2 Vagas</span>
                </div>
                <div className="flex flex-col items-center gap-1 font-bold text-zinc-800">
                  <Icons.PiBathtubFill size={28} />
                  <span className="text-xs uppercase tracking-tighter">2 Banheiros</span>
                </div>
              </div>
            </div>

            {/* Coluna da Direita (Sidebar de Reserva) */}
            <aside className="lg:col-span-4">
              <div className="top-0 border border-borda-cards rounded-3xl p-6 shadow-md flex flex-col gap-4 bg-fundo-cards">
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
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalDetalhes;