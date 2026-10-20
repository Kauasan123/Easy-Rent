import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from '../icons/icons.js';
import Calendario from '../components/Calendario.jsx';
import AvatarUsuario from '../components/AvatarUsuario';

export function ModalDetalhes({ imovel, onClose }) {
  if (!imovel) return null;

  const navigate = useNavigate();

  const [indiceAvaliacao, setIndiceAvaliacao] = React.useState(0);
  const [avaliacoes, setAvaliacoes] = React.useState([]);
  const [mediaAvaliacoes, setMediaAvaliacoes] = React.useState(0);
  const [totalAvaliacoes, setTotalAvaliacoes] = React.useState(0);
  const [mostrarFormAvaliacao, setMostrarFormAvaliacao] = React.useState(false);
  const [nota, setNota] = React.useState(0);
  const [comentario, setComentario] = React.useState('');
  const [enviandoAvaliacao, setEnviandoAvaliacao] = React.useState(false);
  const [erroAvaliacao, setErroAvaliacao] = React.useState('');
  const [checkIn, setCheckIn] = React.useState(null);
  const [checkOut, setCheckOut] = React.useState(null);
  const [hospedes, setHospedes] = React.useState('1');
  const [calendarioAberto, setCalendarioAberto] = React.useState(null);
  const [enviandoReserva, setEnviandoReserva] = React.useState(false);
  const [erroReserva, setErroReserva] = React.useState('');
  const [sucessoReserva, setSucessoReserva] = React.useState(false);
  const [periodoSelecionado, setPeriodoSelecionado] = React.useState(null);
  const [enviandoMensagem, setEnviandoMensagem] = React.useState(false);
  const [erroMensagem, setErroMensagem] = React.useState('');

  const usuarioId = sessionStorage.getItem('usuarioId');

  React.useEffect(() => {
    const carregarAvaliacoes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/avaliacoes/imovel/${imovel.id}`);
        const data = await response.json();
        setAvaliacoes(data.avaliacoes || []);
        setMediaAvaliacoes(data.media || 0);
        setTotalAvaliacoes(data.total || 0);
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
      }
    };
    carregarAvaliacoes();
  }, [imovel.id]);

  const handleEnviarAvaliacao = async () => {
    if (!nota || !comentario.trim()) {
      setErroAvaliacao('Preencha a nota e o comentário.');
      return;
    }
    if (!usuarioId) {
      setErroAvaliacao('Você precisa estar logado para avaliar.');
      return;
    }

    try {
      setEnviandoAvaliacao(true);
      setErroAvaliacao('');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/avaliacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nota,
          comentario,
          imovelId: imovel.id,
          autorId: usuarioId
        })
      });

      const data = await response.json();

      if (response.ok) {
        const resAtualizada = await fetch(`${import.meta.env.VITE_API_URL}/avaliacoes/imovel/${imovel.id}`);
        const dataAtualizada = await resAtualizada.json();
        setAvaliacoes(dataAtualizada.avaliacoes || []);
        setMediaAvaliacoes(dataAtualizada.media || 0);
        setTotalAvaliacoes(dataAtualizada.total || 0);
        setMostrarFormAvaliacao(false);
        setNota(0);
        setComentario('');
      } else {
        setErroAvaliacao(data.erro || 'Erro ao enviar avaliação.');
      }
    } catch (error) {
      setErroAvaliacao('Erro ao conectar com o servidor.');
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  const obterUrl = (imagem) => {
    const caminho = typeof imagem === 'string' ? imagem : imagem?.url;
    if (!caminho) return 'https://via.placeholder.com/600x400?text=Sem+Imagem';
    if (caminho.startsWith('http')) return caminho;
    return `${import.meta.env.VITE_API_URL}${caminho.startsWith('/') ? '' : '/'}${caminho}`;
  };

  const todasImagens = imovel.imagens || [];
  const imagemPrincipal = todasImagens[0] ? obterUrl(todasImagens[0]) : 'https://via.placeholder.com/600x400?text=Sem+Imagem';
  const imagensExtras = todasImagens.slice(1, 4).map(obterUrl);
  const localizacao = [imovel.bairro, imovel.cidade].filter(Boolean).join(', ');

  const proximaAvaliacao = () => { if (indiceAvaliacao + 3 < avaliacoes.length) setIndiceAvaliacao(indiceAvaliacao + 1); };
  const anteriorAvaliacao = () => { if (indiceAvaliacao > 0) setIndiceAvaliacao(indiceAvaliacao - 1); };

  const renderizarEstrelas = (media) => {
    return [1, 2, 3, 4, 5].map((i) => {
      if (media >= i) return <Icons.FaStar key={i} size={20} />;
      if (media >= i - 0.5) return <Icons.FaStarHalfAlt key={i} size={20} />;
      return <Icons.FaRegStar key={i} size={20} />;
    });
  };

  const handleConfirmarReserva = async () => {
    if (!checkIn || !checkOut) {
      setErroReserva('Selecione as datas de check-in e check-out.');
      return;
    }
    if (!usuarioId) {
      setErroReserva('Você precisa estar logado para fazer uma reserva.');
      return;
    }
    if (parseInt(usuarioId) === imovel.usuarioId) {
      setErroReserva('Você não pode reservar seu próprio imóvel.');
      return;
    }
    if (checkIn >= checkOut) {
      setErroReserva('A data de check-out deve ser após o check-in.');
      return;
    }

    const dentroDeUmPeriodo = imovel.periodos?.some(p => {
      const inicio = new Date(p.inicio);
      const fim = new Date(p.fim);
      return checkIn >= inicio && checkOut <= fim;
    });

    if (!dentroDeUmPeriodo) {
      setErroReserva('As datas selecionadas não estão dentro de um período disponível do imóvel.');
      return;
    }

    try {
      setEnviandoReserva(true);
      setErroReserva('');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inicio: checkIn,
          fim: checkOut,
          hospedes: Number(hospedes),
          imovelId: imovel.id,
          hospedeId: usuarioId
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSucessoReserva(true);
        setCheckIn(null);
        setCheckOut(null);
      } else {
        setErroReserva(data.erro || 'Erro ao criar reserva.');
      }
    } catch (error) {
      setErroReserva('Erro ao conectar com o servidor.');
    } finally {
      setEnviandoReserva(false);
    }
  };

  const calcularDias = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calcularTotal = () => {
    return (calcularDias() * parseFloat(imovel.preco)).toFixed(2);
  };

  const dataDisponivel = (data) => {
    if (!imovel.periodos || imovel.periodos.length === 0) return true;
    return imovel.periodos.some(p => {
      const inicio = new Date(p.inicio);
      const fim = new Date(p.fim);
      return data >= inicio && data <= fim;
    });
  };

  const formatarData = (data) => {
    if (!data) return null;
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const handleEnviarMensagem = async () => {
    if (!usuarioId) {
      setErroMensagem('Você precisa estar logado para enviar uma mensagem.');
      return;
    }

    if (Number(usuarioId) === Number(imovel.usuarioId)) {
      setErroMensagem('Você não pode enviar mensagens para si mesmo.');
      return;
    }

    try {
      setEnviandoMensagem(true);
      setErroMensagem('');

      const token = sessionStorage.getItem('token');

      if (!token) {
        setErroMensagem('Sua sessão expirou. Entre novamente na sua conta.');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/conversas`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imovelId: imovel.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.erro || 'Não foi possível iniciar a conversa.'
        );
      }

      window.dispatchEvent(
        new CustomEvent('abrirConversaChat', {
          detail: { conversaId: data.id },
        })
      );

      onClose?.();
    } catch (error) {
      setErroMensagem(
        error.message || 'Erro ao conectar com o servidor.'
      );
    } finally {
      setEnviandoMensagem(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-preto-principal/60 backdrop-blur-sm p-4 overflow-hidden">
      <div className="bg-white w-full max-w-[1150px] h-[95vh] rounded-3xl relative overflow-y-auto p-6 md:p-10 shadow-2xl">

        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-preto-texto-principal hover:bg-cinza-fundo-x rounded-full transition-all z-[100]">
          <Icons.IoIosClose size={32} />
        </button>

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-preto-texto-principal">{imovel.titulo}</h1>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-cinza-texto-secundario text-sm">
              <Icons.FaLocationDot className="text-preto-texto-principal" />
              <span>{localizacao}</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <Icons.FaStar className="text-icone-estrela" />
              <span>{totalAvaliacoes > 0 ? mediaAvaliacoes : 'Novo'} ({totalAvaliacoes} Avaliações)</span>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Coluna Esquerda */}
          <div className="lg:col-span-8 flex flex-col justify-between gap-8 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[500px] overflow-hidden rounded-2xl">
              <div className="h-full overflow-hidden">
                <img src={imagemPrincipal} alt={imovel.titulo} className="w-full h-full object-cover hover:scale-105 transition-all duration-500" />
              </div>
              <div className="grid grid-rows-2 gap-2 h-full">
                <div className="h-full overflow-hidden">
                  <img src={imagensExtras[0] || 'https://via.placeholder.com/600x400?text=Sem+Imagem'} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="h-full overflow-hidden">
                  <img src={imagensExtras[1] || 'https://via.placeholder.com/600x400?text=Sem+Imagem'} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="p-8 bg-fundo-cards rounded-2xl flex justify-between items-center border border-borda-cards">
              <div className="flex flex-col items-center gap-1 font-bold text-preto-texto-principal">
                <Icons.IoPeopleSharp size={28} />
                <span className="text-xs uppercase tracking-tighter">{imovel.capacidade}</span>
              </div>
              <div className="flex flex-col items-center gap-1 font-bold text-preto-texto-principal">
                <Icons.IoIosBed size={28} />
                <span className="text-xs uppercase tracking-tighter">{imovel.quartos} Quartos</span>
              </div>
              <div className="flex flex-col items-center gap-1 font-bold text-preto-texto-principal">
                <Icons.FaCar size={26} />
                <span className="text-xs uppercase tracking-tighter">{imovel.vagas} Vagas</span>
              </div>
              <div className="flex flex-col items-center gap-1 font-bold text-preto-texto-principal">
                <Icons.PiBathtubFill size={28} />
                <span className="text-xs uppercase tracking-tighter">{imovel.banheiros} Banheiros</span>
              </div>
            </div>
          </div>

          {/* Coluna Direita */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="top-0 border border-borda-cards rounded-3xl p-6 flex flex-col gap-3 bg-fundo-cards">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">R$ {imovel.preco}</span>
                <span className="text-cinza-texto-secundario text-sm">/ {imovel.tipoCobranca === 'mes' ? 'Mês' : 'Noite'}</span>
              </div>

              {/* Check-in e Check-out */}
              <div className="relative">
                <div className="grid grid-cols-2 border border-borda-cards rounded-xl overflow-hidden">
                  <div
                    onClick={() => setCalendarioAberto(calendarioAberto === 'checkin' ? null : 'checkin')}
                    className="p-3 border-r border-borda-cards flex flex-col bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-[10px] font-bold uppercase text-preto-texto-principal">Check-in</span>
                    <span className="text-[11px] flex items-center gap-1 mt-1 font-medium text-cinza-texto-secundario">
                      <Icons.FaCalendarAlt size={12} />
                      {checkIn ? formatarData(checkIn) : 'Adicionar Data'}
                    </span>
                  </div>
                  <div
                    onClick={() => setCalendarioAberto(calendarioAberto === 'checkout' ? null : 'checkout')}
                    className="p-3 flex flex-col bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-[10px] font-bold uppercase text-preto-texto-principal">Check-out</span>
                    <span className="text-[11px] flex items-center gap-1 mt-1 font-medium text-cinza-texto-secundario">
                      <Icons.FaCalendarAlt size={12} />
                      {checkOut ? formatarData(checkOut) : 'Adicionar Data'}
                    </span>
                  </div>
                </div>

                {/* Mini calendário */}
                {calendarioAberto && (
                  <div className="absolute z-50 top-full left-0 mt-2 bg-white border border-borda-cards rounded-2xl shadow-2xl p-4 w-full">
                    <p className="text-xs font-bold text-cinza-texto-secundario mb-3 uppercase">
                      Selecione um período disponível
                    </p>

                    {/* Períodos disponíveis */}
                    {imovel.periodos && imovel.periodos.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {imovel.periodos.map((p, i) => {
                          const inicio = new Date(p.inicio);
                          const fim = new Date(p.fim);
                          const selecionado = periodoSelecionado?.inicio?.getTime() === inicio.getTime();

                          return (
                            <div key={i} className="flex flex-col gap-2">
                              <button type="button" onClick={() => {
                                setPeriodoSelecionado({ inicio, fim });
                                setCheckIn(null);
                                setCheckOut(null);
                              }}
                                className={`text-left px-3 py-2 border rounded-xl text-xs font-semibold transition-all ${selecionado ? 'bg-beje-principal text-white border-beje-principal' : 'border-borda-cards text-preto-texto-principal hover:bg-beje-principal hover:text-white hover:border-beje-principal'}`}
                              >
                                {inicio.toLocaleDateString('pt-BR')} → {fim.toLocaleDateString('pt-BR')}
                              </button>

                              {/* Inputs de data aparecem ao selecionar o período */}
                              {selecionado && (
                                <div className="flex flex-col gap-2 p-3 bg-fundo-cards border border-borda-cards rounded-xl">
                                  <Calendario
                                    startDate={checkIn}
                                    endDate={checkOut}
                                    setStartDate={setCheckIn}
                                    setEndDate={setCheckOut}
                                    minDate={inicio}
                                    maxDate={fim}
                                  />
                                  <button type="button" onClick={() => setCalendarioAberto(null)} disabled={!checkIn || !checkOut} className="w-full mt-1 bg-preto-texto-principal hover:bg-zinc-800 disabled:opacity-50 text-white py-2 rounded-lg text-xs font-bold transition-colors">
                                    Confirmar datas
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-cinza-texto-secundario italic">Nenhum período disponível.</p>
                    )}

                    <button type="button" onClick={() => { setCalendarioAberto(null); setPeriodoSelecionado(null); }} className="w-full mt-3 text-xs text-cinza-texto-secundario hover:text-preto-texto-principal font-semibold transition-colors">
                      Fechar
                    </button>
                  </div>
                )}
              </div>

              {/* Hóspedes */}
              <div className="border border-borda-cards rounded-xl bg-white overflow-hidden">
                <div className="p-3">
                  <span className="text-[10px] font-bold uppercase text-preto-texto-principal">
                    Hóspedes
                  </span>

                  <div className="flex items-center gap-2 mt-1 border p-2 border-borda-cards rounded-lg">
                    <input type="number" min="1" max={imovel.capacidade || 99} value={hospedes} onFocus={(e) => e.target.select()} onChange={(e) => {
                      const valor = e.target.value;

                      if (valor === '') {
                        setHospedes('');
                        return;
                      }

                      const numero = Number(valor);

                      if (numero < 1) {
                        setHospedes('1');
                        return;
                      }

                      if (imovel.capacidade && numero > imovel.capacidade) {
                        setHospedes(String(imovel.capacidade));
                        return;
                      }

                      setHospedes(valor);
                    }}
                      onBlur={() => {
                        if (hospedes === '') {
                          setHospedes('1');
                        }
                      }}
                      className="w-full text-sm font-medium text-preto-texto-principal outline-none bg-transparent" />
                    <span className="text-[11px] text-cinza-texto-secundario whitespace-nowrap">
                      Hóspedes
                    </span>
                  </div>
                </div>
              </div>

              {/* Resumo do preço */}
              {checkIn && checkOut && calcularDias() > 0 && (
                <div className="bg-white border border-borda-cards rounded-xl p-3 flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold text-cinza-texto-secundario">
                    <span>R$ {imovel.preco} × {calcularDias()} {imovel.tipoCobranca === 'mes' ? 'meses' : 'noites'}</span>
                    <span>R$ {calcularTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-preto-texto-principal border-t border-borda-cards pt-2 mt-1">
                    <span>Total</span>
                    <span>R$ {calcularTotal()}</span>
                  </div>
                </div>
              )}

              {/* Erro */}
              {erroReserva && (
                <p className="text-xs text-red-500 font-semibold">{erroReserva}</p>
              )}

              {/* Sucesso */}
              {sucessoReserva ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                  <p className="text-emerald-700 font-bold text-sm">
                    Reserva enviada com sucesso!
                  </p>

                  <p className="text-emerald-600 text-xs mt-1">
                    Aguarde a confirmação do anfitrião.
                  </p>

                  <button onClick={() => setSucessoReserva(false)} className="mt-2 text-xs text-emerald-700 font-bold hover:underline">
                    Fazer outra reserva
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    navigate('/revisaoReserva', {
                      state: {
                        imovel,
                        checkIn,
                        checkOut,
                        hospedes: Number(hospedes)
                      }
                    })
                  }
                  disabled={!checkIn || !checkOut}
                  className="w-full bg-beje-principal text-branco-texto-principal font-bold py-4 rounded-xl hover:bg-botao-beje-apertado transition-all active:scale-95 shadow-lg shadow-beje-principal/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkIn && checkOut
                    ? 'Avançar para Reserva'
                    : 'Avançar para Reserva'}
                </button>
              )}

              <p className="text-center text-[11px] text-cinza-texto-secundario font-medium">Você ainda não será cobrado</p>

              {/* Anfitrião */}
              <div className="mt-2 p-4 border border-borda-cards rounded-2xl flex flex-col gap-3 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                    <AvatarUsuario nome={imovel.usuario?.nome || 'Anfitrião'} src={imovel.usuario?.avatarPath
                      ? `${import.meta.env.VITE_API_URL}${imovel.usuario.avatarPath}`
                      : null} className="w-full h-full" textoClassName="text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-preto-texto-principal">Anfitrião: {imovel.usuario?.nome || 'Não informado'}</span>
                    <span className="text-[10px] text-cinza-texto-secundario font-bold uppercase tracking-tight">
                      Membro desde {imovel.usuario?.criadoEm ? new Date(imovel.usuario.criadoEm).getFullYear() : '—'}
                    </span>
                  </div>
                </div>

                {erroMensagem && (
                  <p className="text-xs font-semibold text-red-500">
                    {erroMensagem}
                  </p>
                )}

                <button type="button" onClick={handleEnviarMensagem} disabled={enviandoMensagem} className="w-full border border-beje-principal text-beje-principal text-[11px] font-bold py-2.5 rounded-lg hover:bg-botao-beje-apertado hover:text-branco-texto-principal transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {enviandoMensagem ? 'Abrindo conversa...' : 'Enviar Mensagem'}
                </button>
              </div>
            </div>

            {/* Localização */}
            <div className="border border-borda-cards rounded-3xl p-6 bg-fundo-cards flex flex-col gap-2">
              <h3 className="font-bold text-preto-texto-principal text-lg">Localização</h3>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm text-preto-texto-principal">{localizacao}</span>
                <p className="text-cinza-texto-secundario text-xs leading-relaxed">{imovel.endereco} — CEP {imovel.cep}</p>
                {imovel.proximoCentro && <span className="text-xs font-medium text-preto-texto-principal">• Próximo ao Centro</span>}
                {imovel.proximoPraia && <span className="text-xs font-medium text-preto-texto-principal">• Próximo à Praia</span>}
              </div>
            </div>
          </aside>
        </div>

        {/* Sobre o Lugar */}
        <div className='pt-10'>
          <h2 className='text-preto-texto-principal text-2xl font-semibold mb-4'>Sobre o lugar</h2>
          <p className='text-preto-texto-principal max-w-prose leading-relaxed'>
            {imovel.descricao || 'Sem descrição disponível.'}
          </p>
        </div>

        {/* Comodidades e Regras */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-fundo-cards border border-borda-cards rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6">Comodidades</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {imovel.hasWifi && <div className="flex items-center gap-2 font-bold text-sm"><Icons.FaWifi className="text-beje-principal" /> <span>Wi-Fi</span></div>}
              {imovel.hasMaquinaLavar && <div className="flex items-center gap-2 font-bold text-sm"><Icons.LuWashingMachine className="text-beje-principal" /> <span>Máquina de Lavar</span></div>}
              {imovel.hasArCondicionado && <div className="flex items-center gap-2 font-bold text-sm"><Icons.LuWind className="text-beje-principal" /> <span>Ar-Condicionado</span></div>}
              {imovel.hasChurrascaria && <div className="flex items-center gap-2 font-bold text-sm"><Icons.MdOutlineOutdoorGrill className="text-beje-principal" size={18} /> <span>Churrascaria</span></div>}
              {imovel.hasEstacionamento && <div className="flex items-center gap-2 font-bold text-sm"><Icons.FaCar className="text-beje-principal" /> <span>Estacionamento</span></div>}
              {imovel.hasElevador && <div className="flex items-center gap-2 font-bold text-sm"><Icons.PiElevator className="text-beje-principal" size={18} /> <span>Elevador</span></div>}
              {imovel.hasPiscina && <div className="flex items-center gap-2 font-bold text-sm"><Icons.FaSwimmingPool className="text-beje-principal" /> <span>Piscina</span></div>}
              {imovel.hasPortaria24h && <div className="flex items-center gap-2 font-bold text-sm"><Icons.MdOutlineShieldMoon className="text-beje-principal" /> <span>Portaria 24h</span></div>}
              {imovel.hasTv && <div className="flex items-center gap-2 font-bold text-sm"><Icons.FaTv className="text-beje-principal" /> <span>TV</span></div>}
              {!imovel.hasWifi && !imovel.hasMaquinaLavar && !imovel.hasArCondicionado && !imovel.hasChurrascaria &&
                !imovel.hasEstacionamento && !imovel.hasElevador && !imovel.hasPiscina && !imovel.hasPortaria24h && !imovel.hasTv && (
                  <p className="text-xs text-cinza-texto-secundario italic col-span-2">Nenhuma comodidade cadastrada.</p>
                )}
            </div>
          </div>

          <div className="bg-fundo-cards border border-borda-cards rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6">Regras da Casa</h3>
            <div className="flex flex-col gap-4">
              {imovel.aceitaPets && <div className="flex items-center gap-2 font-bold text-sm"><Icons.FaDog className="text-beje-principal" /> <span>Aceita Pets</span></div>}
              {imovel.permiteFestas && <div className="flex items-center gap-2 font-bold text-sm"><Icons.BiParty className="text-beje-principal" /> <span>Permite Festas</span></div>}
              {imovel.acessibilidade && <div className="flex items-center gap-2 font-bold text-sm"><Icons.FaWheelchair className="text-beje-principal" /> <span>Acessibilidade</span></div>}
              {imovel.naoFumante && <div className="flex items-center gap-2 font-bold text-sm"><Icons.FaBanSmoking className="text-beje-principal" /> <span>Não Fumante</span></div>}
              {!imovel.aceitaPets && !imovel.permiteFestas && !imovel.acessibilidade && !imovel.naoFumante && (
                <p className="text-xs text-cinza-texto-secundario italic">Nenhuma regra cadastrada.</p>
              )}
            </div>
          </div>
        </div>

        {/* Avaliações */}
        <div className="pt-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-preto-texto-principal">Avaliação de Hóspedes</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-3xl font-bold text-preto-texto-principal">
                  {totalAvaliacoes > 0 ? mediaAvaliacoes : '—'}
                </span>
                <div className="flex items-center text-icone-estrela">
                  {totalAvaliacoes > 0 ? renderizarEstrelas(parseFloat(mediaAvaliacoes)) : <Icons.FaRegStar size={20} />}
                </div>
                <span className="text-cinza-texto-secundario text-sm font-medium">({totalAvaliacoes} Avaliações)</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={anteriorAvaliacao} disabled={indiceAvaliacao === 0} className={`p-2.5 rounded-full transition-all border border-transparent hover:border-borda-cards ${indiceAvaliacao === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-cinza-fundo-x'}`}>
                <Icons.IoIosArrowBack size={24} className="text-cinza-texto-secundario" />
              </button>
              <button onClick={proximaAvaliacao} disabled={indiceAvaliacao + 3 >= avaliacoes.length} className={`p-2.5 rounded-full transition-all border border-transparent hover:border-borda-cards ${indiceAvaliacao + 3 >= avaliacoes.length ? 'opacity-30 cursor-not-allowed' : 'hover:bg-cinza-fundo-x'}`}>
                <Icons.IoIosArrowForward size={24} className="text-preto-texto-principal" />
              </button>
            </div>
          </div>

          {/* Cards de Avaliação */}
          {avaliacoes.length === 0 ? (
            <p className="text-cinza-texto-secundario text-sm italic">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {avaliacoes.slice(indiceAvaliacao, indiceAvaliacao + 3).map((avaliacao) => (
                <div key={avaliacao.id} className="border border-borda-cards rounded-2xl p-6 flex flex-col justify-between min-h-[200px] bg-white hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-100 shrink-0">
                        <AvatarUsuario nome={avaliacao.autor?.nome || 'Usuário'} src={avaliacao.autor?.avatarPath
                          ? `${import.meta.env.VITE_API_URL}${avaliacao.autor.avatarPath}`
                          : null} className="w-full h-full" textoClassName="text-base" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-preto-texto-principal">{avaliacao.autor?.nome || 'Usuário'}</span>
                        <span className="text-cinza-texto-secundario text-xs font-medium">
                          {new Date(avaliacao.criadoEm).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-preto-texto-principal leading-relaxed line-clamp-3">{avaliacao.comentario}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-4 font-bold text-base text-preto-texto-principal">
                    <Icons.FaStar className="text-icone-estrela" size={20} />
                    <span>{avaliacao.nota.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formulário de Avaliação */}
          <div className="mt-10">
            {!mostrarFormAvaliacao ? (
              <button onClick={() => setMostrarFormAvaliacao(true)} className="bg-beje-principal text-branco-texto-principal font-bold px-10 py-3.5 rounded-xl hover:bg-botao-beje-apertado transition-all active:scale-95 shadow-md">
                Fazer Avaliação
              </button>
            ) : (
              <div className="border border-borda-cards rounded-3xl p-6 bg-fundo-cards flex flex-col gap-4 max-w-xl">
                <h3 className="text-lg font-bold text-preto-texto-principal">Sua Avaliação</h3>

                {/* Seletor de Nota */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-preto-texto-principal">Nota</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((estrela) => (
                      <button key={estrela} type="button" onClick={() => setNota(estrela)} className="transition-transform hover:scale-110">
                        {nota >= estrela
                          ? <Icons.FaStar className="text-icone-estrela" size={28} />
                          : <Icons.FaRegStar className="text-zinc-300" size={28} />
                        }
                      </button>
                    ))}
                    <span className="text-sm font-bold text-preto-texto-principal ml-2">{nota > 0 ? `${nota}.0` : ''}</span>
                  </div>
                </div>

                {/* Comentário */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-preto-texto-principal">Comentário</label>
                  <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} rows={4} maxLength={500} placeholder="Conte sua experiência..." className="w-full bg-white border border-borda-cards rounded-xl p-4 text-sm text-preto-texto-principal outline-none resize-none" />
                  <span className="text-[10px] text-gray-400 font-bold text-right">{comentario.length}/500</span>
                </div>

                {erroAvaliacao && (
                  <p className="text-xs text-red-500 font-semibold">{erroAvaliacao}</p>
                )}

                <div className="flex gap-3">
                  <button onClick={handleEnviarAvaliacao} disabled={enviandoAvaliacao} className="px-6 py-3 bg-beje-principal text-white font-bold rounded-xl hover:bg-botao-beje-apertado transition-all disabled:opacity-50 text-sm">
                    {enviandoAvaliacao ? 'Enviando...' : 'Enviar Avaliação'}
                  </button>
                  <button onClick={() => { setMostrarFormAvaliacao(false); setErroAvaliacao(''); setNota(0); setComentario(''); }} className="px-6 py-3 bg-white border border-preto-texto-principal text-preto-texto-principal font-bold rounded-xl hover:bg-botao-branco-apertado transition-all text-sm">
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDetalhes;