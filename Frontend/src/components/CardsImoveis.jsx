import React, { useState } from 'react';
import * as Icons from '../icons/icons.js';

export function CardsImoveis({ imovel, isGerenciamento = false, onEdit, dataSelecionada = null, dataFim = null }) {
  const [fotoAtual, setFotoAtual] = useState(0);

  const listaImagens = imovel.imagens || (imovel.imagem ? [imovel.imagem] : []);
  
  const obterProximaDataDisponivel = () => {
    if (!imovel.periodos || imovel.periodos.length === 0) {
      return 'Sem datas disponíveis';
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const periodosProcessados = imovel.periodos
      .map(p => ({
        ...p,
        dataInicio: new Date(p.inicio),
        dataFim: new Date(p.fim)
      }))
      .filter(p => p.dataFim >= hoje)
      .sort((a, b) => a.dataInicio - b.dataInicio);

    if (periodosProcessados.length === 0) {
      return 'Sem datas disponíveis';
    }

    let periodoSelecionado = null;

    if (dataSelecionada) {
      const dataSelecionadaObj = new Date(dataSelecionada);
      dataSelecionadaObj.setHours(0, 0, 0, 0);

      periodoSelecionado = periodosProcessados.find(p => 
        p.dataInicio <= dataSelecionadaObj && dataSelecionadaObj <= p.dataFim
      );

      if (!periodoSelecionado) {
        periodoSelecionado = periodosProcessados[0];
      }
    } else {
      periodoSelecionado = periodosProcessados[0];
    }

    // Formatar as datas
    const diaInicio = periodoSelecionado.dataInicio.getDate();
    const diaFim = periodoSelecionado.dataFim.getDate();
    
    const opcoes = { month: 'short' };
    const mesFim = periodoSelecionado.dataFim.toLocaleDateString('pt-BR', opcoes).replace('.', '');

    return `Disponível ${diaInicio} - ${diaFim} ${mesFim}`;
  };

  const obterUrlImagem = (imagem) => {
    const caminho = typeof imagem === 'string' ? imagem : imagem?.url;
    
    if (!caminho) {
      return 'https://via.placeholder.com/300x200?text=Sem+Imagem';
    }
    if (caminho.startsWith('http://') || caminho.startsWith('https://')) {
      return caminho;
    }
    const urlFinal = `${import.meta.env.VITE_API_URL}${caminho.startsWith('/') ? '' : '/'}${caminho}`;
    return urlFinal;
  };

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
    <div className='relative border border-borda-cards h-[380px] 2xl:h-[420px] w-full max-w-[280px] 2xl:max-w-[300px] mx-auto rounded-xl overflow-hidden shadow-sm flex flex-col bg-white'>
      <div className='relative h-[50%] w-full overflow-hidden group'>
        
        <img src={obterUrlImagem(listaImagens[fotoAtual])} alt={imovel.titulo} className='w-full h-full object-cover transition-transform duration-300 hover:scale-110' />
        
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

      {/* Info do Card */}
      <div className="p-3 2xl:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className='flex flex-row items-center justify-between mb-1 gap-1'>
            <span className="text-base 2xl:text-lg font-bold text-preto-texto-principal truncate">
              {imovel.titulo || "Imóvel sem título"}
            </span>
            <div className='flex flex-row items-center shrink-0'>
              <Icons.FaStar className='text-icone-estrela' size={16} />
              <span className='text-sm 2xl:text-base font-bold ml-1 text-preto-texto-principal'>
                {imovel.nota || "Novo"}
              </span>
            </div>
          </div>
          
          <div className='leading-tight min-h-[2.5rem] 2xl:min-h-[3rem]'>
            <p className='text-sm 2xl:text-base text-preto-texto-principal/50 line-clamp-2'>
              {imovel.subtitulo || imovel.endereco || imovel.localizacao || "Endereço não informado"}
            </p>
          </div>
          
          <div>
            <span className='text-sm 2xl:text-base text-preto-texto-principal/50'>
              {obterProximaDataDisponivel()}
            </span>
          </div>
        </div>

        <div className='flex gap-3 2xl:gap-5 my-2'>
          <div className='flex flex-row items-center gap-1 shrink-0'>
            <Icons.IoIosBed className='text-preto-principal' size={18} />
            <span className='text-sm 2xl:text-base font-semibold text-preto-principal'>
              {imovel.quartos ?? 0} Quartos
            </span>
          </div>
          <div className='flex flex-row items-center gap-1 shrink-0'>
            <Icons.FaCar className='text-preto-principal' size={16} />
            <span className='text-sm 2xl:text-base font-semibold text-preto-principal'>
              {imovel.vagas ?? 0} Vagas
            </span>
          </div>
        </div>

        {/* Linha de Ação Inferior Alternável */}
        <div className='flex flex-row items-center justify-between pt-1 pb-1'>
          <span className="text-lg text-beje-principal font-bold whitespace-nowrap">
            R$ {imovel.preco || "0,00"}
          </span>

          {isGerenciamento ? (
            <button type="button" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onEdit) {
                  onEdit(imovel);
                }
              }}
              className='text-beje-principal border border-beje-principal rounded-md text-[14px] py-1 px-4 2xl:py-1.5 2xl:px-6 hover:bg-botao-branco-apertado transition-all font-medium whitespace-nowrap active:scale-95'>
              Editar
            </button>
          ) : (
            <a href="#" className='text-beje-principal border border-beje-principal rounded-md text-[14px] py-1 px-2 2xl:py-1.5 2xl:px-4 hover:bg-botao-branco-apertado transition-all font-medium whitespace-nowrap active:scale-95'>
              Ver Detalhes
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardsImoveis;