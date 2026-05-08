import React, { useState } from 'react';
import * as Icons from '../icons/icons.js';

export function CardsImoveis({ imovel }) {
  const [fotoAtual, setFotoAtual] = useState(0);

  const listaImagens = imovel.imagens || [imovel.imagem];

  const proximaFoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFotoAtual((prev) => (prev === listaImagens.length - 1 ? 0 : prev + 1));
  };

  const fotoAnterior = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFotoAtual((prev) => (prev === 0 ? listaImagens.length - 1 : prev - 1));
  };

  return (
    <div className='relative border h-[380px] 2xl:h-[420px] w-full max-w-[280px] 2xl:max-w-[300px] mx-auto rounded-xl overflow-hidden shadow-sm flex flex-col'>
      <div className='relative h-[50%] w-full overflow-hidden group'>
        <img src={listaImagens[fotoAtual]} alt={imovel.titulo} className='w-full h-full object-cover transition-transform duration-300 hover:scale-110' />
        {listaImagens.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={fotoAnterior} className="bg-white/70 p-1 rounded-full hover:bg-white text-preto-texto-principal transition-all active:scale-90">
              <Icons.IoIosArrowBack size={18} />
            </button>
            <button 
              onClick={proximaFoto}
              className="bg-white/70 p-1 rounded-full hover:bg-white text-preto-texto-principal transition-all active:scale-90"
            >
              <Icons.IoIosArrowForward size={18} />
            </button>
          </div>
        )}

        {/* Indicadores (Pontinhos) */}
        <div className="absolute bottom-2 w-full flex justify-center gap-1 pointer-events-none">
          {listaImagens.map((_, index) => (
            <div 
              key={index} 
              className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${index === fotoAtual ? 'bg-white w-3' : 'bg-white/60'}`}
            ></div>
          ))}
        </div>
      </div>

      {/* Info do Card (Seu código original mantido) */}
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
            <p className='text-sm 2xl:text-base text-preto-texto-principal/50 line-clamp-2'>{imovel.subtitulo}</p>
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
          <span className="text-lg text-beje-principal font-bold whitespace-nowrap">R$ {imovel.preco}</span>
          <a href="#" className='text-beje-principal border border-beje-principal rounded-md text-[14px] py-1 px-2 2xl:py-1.5 2xl:px-4 hover:bg-botao-branco-apertado transition-all font-medium whitespace-nowrap active:scale-95'>
            Ver Detalhes
          </a>
        </div>
      </div>
    </div>
  );
}

export default CardsImoveis;