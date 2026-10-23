import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import * as Icons from '../icons/icons.js';
import AvatarUsuario from '../components/AvatarUsuario';

const API_URL = `${import.meta.env.VITE_API_URL}/chat`;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const obterUrlAvatar = (avatarPath) => {
    if (!avatarPath || typeof avatarPath !== 'string') {
        return null;
    }

    const caminho = avatarPath.trim();

    if (!caminho) {
        return null;
    }

    if (/^https?:\/\//i.test(caminho)) {
        return caminho;
    }

    const apiUrl = import.meta.env.VITE_API_URL || '';
    const baseUrl = apiUrl
        .replace(/\/api\/?$/, '')
        .replace(/\/+$/, '');

    const caminhoLimpo = caminho.replace(/^\/+/, '');

    return baseUrl
        ? `${baseUrl}/${caminhoLimpo}`
        : `/${caminhoLimpo}`;
};

const obterHora = (data) => {
    if (!data) return '';

    return new Date(data).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

const Chat = () => {
    const [chatAberto, setChatAberto] = useState(false);
    const [conversas, setConversas] = useState([]);
    const [conversaAtiva, setConversaAtiva] = useState(null);
    const [pesquisa, setPesquisa] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [carregandoConversas, setCarregandoConversas] = useState(true);
    const [carregandoMensagens, setCarregandoMensagens] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [erroChat, setErroChat] = useState('');

    const socketRef = useRef(null);
    const conversaAtivaRef = useRef(null);
    const conversasRef = useRef([]);
    const requisicaoMensagensRef = useRef(0);

    const areaMensagensRef = useRef(null);
    const finalMensagensRef = useRef(null);

    const usuarioId = Number(sessionStorage.getItem('usuarioId'));
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        conversasRef.current = conversas;
    }, [conversas]);

    useEffect(() => {
        if (!conversaAtiva) return;

        const area = areaMensagensRef.current;
        const final = finalMensagensRef.current;

        if (!area || !final) return;

        requestAnimationFrame(() => {
            final.scrollIntoView({
                behavior: carregandoMensagens ? 'auto' : 'smooth',
                block: 'end',
            });
        });
    }, [conversaAtiva, conversas, carregandoMensagens]);

    const requisicaoChat = async (caminho, opcoes = {}) => {
        if (!token) {
            throw new Error(
                'Sua sessão expirou. Entre novamente na sua conta.'
            );
        }

        const resposta = await fetch(`${API_URL}${caminho}`, {
            ...opcoes,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(opcoes.body
                    ? { 'Content-Type': 'application/json' }
                    : {}),
                ...opcoes.headers,
            },
        });

        const dados = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
            throw new Error(
                dados.erro || 'Não foi possível concluir a operação.'
            );
        }

        return dados;
    };

    const conversasFiltradas = conversas.filter((conversa) =>
        `${conversa.nome} ${conversa.imovel} ${conversa.ultimaMensagem}`
            .toLowerCase()
            .includes(pesquisa.toLowerCase())
    );

    const conversaSelecionada = conversas.find(
        (conversa) => Number(conversa.id) === Number(conversaAtiva)
    );

    const totalNaoLidas = conversas.reduce(
        (total, conversa) => total + (conversa.naoLidas || 0),
        0
    );

    useEffect(() => {
        let cancelado = false;

        const carregarConversas = async () => {
            setCarregandoConversas(true);
            setErroChat('');

            try {
                const dados = await requisicaoChat('/conversas');

                if (cancelado) return;

                const conversasFormatadas = dados.map((conversa) => {
                    const ultima = conversa.mensagens?.[0];
                    const nome = conversa.outroUsuario?.nome || 'Usuário';

                    return {
                        id: conversa.id,
                        nome,
                        avatarPath:
                            conversa.outroUsuario?.avatarPath || null,
                        imovel: conversa.imovel?.titulo || 'Imóvel',
                        ultimaMensagem:
                            ultima?.texto || 'Nenhuma mensagem ainda',
                        horario: ultima ? obterHora(ultima.criadaEm) : '',
                        naoLidas: conversa.naoLidas ?? 0,
                        mensagens: [],
                    };
                });

                conversasRef.current = conversasFormatadas;
                setConversas(conversasFormatadas);

                conversasFormatadas.forEach((conversa) => {
                    socketRef.current?.emit(
                        'entrarConversa',
                        conversa.id
                    );
                });
            } catch (erro) {
                if (!cancelado) {
                    setErroChat(erro.message);
                }
            } finally {
                if (!cancelado) {
                    setCarregandoConversas(false);
                }
            }
        };

        carregarConversas();

        return () => {
            cancelado = true;
        };
    }, []);

    useEffect(() => {
        if (!token || !Number.isInteger(usuarioId) || usuarioId <= 0) {
            return;
        }

        const socket = io(SOCKET_URL, {
            auth: { token },
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            conversasRef.current.forEach((conversa) => {
                socket.emit('entrarConversa', conversa.id);
            });
        });

        socket.on('novaMensagem', (item) => {
            const conversaId = Number(item.conversaId);
            const remetenteId = Number(item.remetenteId);
            const usuarioAtual = Number(usuarioId);

            const conversaEstaAberta =
                Number(conversaAtivaRef.current) === conversaId;

            const mensagemFormatada = {
                id: item.id,
                texto: item.texto,
                hora: obterHora(item.criadaEm),
                enviada: remetenteId === usuarioAtual,
            };

            setConversas((atuais) =>
                atuais.map((conversa) => {
                    if (Number(conversa.id) !== conversaId) {
                        return conversa;
                    }

                    const jaExiste = conversa.mensagens.some(
                        (mensagemExistente) =>
                            Number(mensagemExistente.id) === Number(item.id)
                    );

                    const mensagensAtualizadas =
                        conversaEstaAberta && !jaExiste
                            ? [...conversa.mensagens, mensagemFormatada]
                            : conversa.mensagens;

                    return {
                        ...conversa,
                        mensagens: mensagensAtualizadas,
                        ultimaMensagem: item.texto,
                        horario: mensagemFormatada.hora,
                        naoLidas: mensagemFormatada.enviada
                            ? conversa.naoLidas
                            : conversaEstaAberta
                                ? 0
                                : (conversa.naoLidas || 0) + 1,
                    };
                })
            );

            if (conversaEstaAberta && remetenteId !== usuarioAtual) {
                requisicaoChat(
                    `/conversas/${conversaId}/lidas`,
                    { method: 'PATCH' }
                ).catch(() => { });
            }
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [token, usuarioId]);

    const abrirConversa = async (id) => {
        conversaAtivaRef.current = id;
        setConversaAtiva(id);
        setMensagem('');
        setErroChat('');
        setCarregandoMensagens(true);

        const numeroRequisicao = ++requisicaoMensagensRef.current;

        socketRef.current?.emit('entrarConversa', id);

        try {
            const dados = await requisicaoChat(
                `/conversas/${id}/mensagens`
            );

            if (
                numeroRequisicao !== requisicaoMensagensRef.current ||
                Number(conversaAtivaRef.current) !== Number(id)
            ) {
                return;
            }

            const mensagensFormatadas = dados.map((item) => ({
                id: item.id,
                texto: item.texto,
                hora: obterHora(item.criadaEm),
                enviada: Number(item.remetenteId) === usuarioId,
            }));

            setConversas((atuais) =>
                atuais.map((conversa) => {
                    if (Number(conversa.id) !== Number(id)) {
                        return conversa;
                    }

                    const mensagensPorId = new Map();

                    mensagensFormatadas.forEach((item) => {
                        mensagensPorId.set(Number(item.id), item);
                    });

                    conversa.mensagens.forEach((item) => {
                        mensagensPorId.set(Number(item.id), item);
                    });

                    const mensagensCombinadas = [
                        ...mensagensPorId.values(),
                    ].sort((a, b) => Number(a.id) - Number(b.id));

                    return {
                        ...conversa,
                        mensagens: mensagensCombinadas,
                        naoLidas: 0,
                    };
                })
            );

            await requisicaoChat(`/conversas/${id}/lidas`, {
                method: 'PATCH',
            });
        } catch (erro) {
            if (numeroRequisicao === requisicaoMensagensRef.current) {
                setErroChat(erro.message);
            }
        } finally {
            if (numeroRequisicao === requisicaoMensagensRef.current) {
                setCarregandoMensagens(false);
            }
        }
    };

    const abrirConversaRef = useRef(abrirConversa);

    useEffect(() => {
        abrirConversaRef.current = abrirConversa;
    });

    useEffect(() => {
        const handleAbrirConversa = async (evento) => {
            const id = Number(evento.detail?.conversaId);

            if (!Number.isInteger(id) || id <= 0) {
                return;
            }

            setChatAberto(true);
            setPesquisa('');
            setErroChat('');
            setCarregandoConversas(true);

            try {
                const dados = await requisicaoChat('/conversas');

                const conversasFormatadas = dados.map((conversa) => {
                    const ultima = conversa.mensagens?.[0];
                    const nome = conversa.outroUsuario?.nome || 'Usuário';

                    return {
                        id: conversa.id,
                        nome,
                        avatarPath:
                            conversa.outroUsuario?.avatarPath || null,
                        imovel: conversa.imovel?.titulo || 'Imóvel',
                        ultimaMensagem:
                            ultima?.texto || 'Nenhuma mensagem ainda',
                        horario: ultima ? obterHora(ultima.criadaEm) : '',
                        naoLidas: conversa.naoLidas ?? 0,
                        mensagens: [],
                    };
                });

                conversasRef.current = conversasFormatadas;
                setConversas(conversasFormatadas);

                conversasFormatadas.forEach((conversa) => {
                    socketRef.current?.emit(
                        'entrarConversa',
                        conversa.id
                    );
                });

                await abrirConversaRef.current(id);
            } catch (erro) {
                setErroChat(
                    erro.message || 'Não foi possível abrir a conversa.'
                );
            } finally {
                setCarregandoConversas(false);
            }
        };

        window.addEventListener('abrirConversaChat', handleAbrirConversa);

        return () => {
            window.removeEventListener(
                'abrirConversaChat',
                handleAbrirConversa
            );
        };
    }, []);

    const voltarParaLista = () => {
        conversaAtivaRef.current = null;
        setConversaAtiva(null);
        setMensagem('');
        setErroChat('');
        requisicaoMensagensRef.current += 1;
    };

    const fecharChat = () => {
        conversaAtivaRef.current = null;
        setChatAberto(false);
        setConversaAtiva(null);
        setMensagem('');
        requisicaoMensagensRef.current += 1;
    };

    const enviarMensagem = async (evento) => {
        evento.preventDefault();

        const texto = mensagem.trim();
        const conversaIdEnvio = conversaAtiva;

        if (
            !texto ||
            !conversaSelecionada ||
            !conversaIdEnvio ||
            enviando
        ) {
            return;
        }

        setEnviando(true);
        setErroChat('');

        try {
            const item = await requisicaoChat(
                `/conversas/${conversaIdEnvio}/mensagens`,
                {
                    method: 'POST',
                    body: JSON.stringify({ texto }),
                }
            );

            const novaMensagem = {
                id: item.id,
                texto: item.texto,
                hora: obterHora(item.criadaEm),
                enviada: Number(item.remetenteId) === usuarioId,
            };

            setConversas((atuais) =>
                atuais.map((conversa) => {
                    if (
                        Number(conversa.id) !== Number(conversaIdEnvio)
                    ) {
                        return conversa;
                    }

                    const jaExiste = conversa.mensagens.some(
                        (itemExistente) =>
                            Number(itemExistente.id) === Number(novaMensagem.id)
                    );

                    return {
                        ...conversa,
                        mensagens: jaExiste
                            ? conversa.mensagens
                            : [...conversa.mensagens, novaMensagem],
                        ultimaMensagem: item.texto,
                        horario: novaMensagem.hora,
                        naoLidas: 0,
                    };
                })
            );

            setMensagem('');
        } catch (erro) {
            setErroChat(erro.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <>
            {chatAberto && (
                <section className="fixed bottom-24 right-6 z-[1000] flex h-[min(560px,calc(100dvh-7.5rem))] w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-[#E8DED2] bg-white shadow-[0_12px_50px_rgba(45,35,25,0.20)]" aria-label="Mensagens do Easy Rent" >
                    <header className="flex shrink-0 items-center gap-3 bg-[#A57849] px-4 py-4 text-white">
                        {conversaSelecionada ? (
                            <>
                                <button type="button" onClick={voltarParaLista} className="rounded-full p-1.5 transition hover:bg-white/15" aria-label="Voltar para conversas" >
                                    <span className="text-2xl leading-none">
                                        <Icons.IoIosArrowBack size={14} />
                                    </span>
                                </button>

                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/30">
                                    <AvatarUsuario nome={conversaSelecionada.nome} src={obterUrlAvatar(
                                        conversaSelecionada.avatarPath
                                    )} className="h-full w-full" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h2 className="truncate font-semibold">
                                        {conversaSelecionada.nome}
                                    </h2>
                                    <p className="truncate text-xs text-white/80">
                                        {conversaSelecionada.imovel}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                                    <Icons.IoIosChatbubbles size={24} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h2 className="text-lg font-bold">
                                        Mensagens
                                    </h2>
                                    <p className="text-xs text-white/80">
                                        Suas conversas no Easy Rent
                                    </p>
                                </div>
                            </>
                        )}

                        <button type="button" onClick={fecharChat} className="rounded-full p-2 transition hover:bg-white/15" aria-label="Fechar chat" >
                            <Icons.IoIosClose size={27} />
                        </button>
                    </header>

                    {!conversaSelecionada && (
                        <>
                            <div className="shrink-0 border-b border-[#F0E9E1] bg-white p-3">
                                <div className="flex items-center gap-2 rounded-xl bg-[#F7F4F0] px-3">
                                    <span className="text-lg text-[#9B8A78]">
                                        <Icons.IoIosSearch size={24} />
                                    </span>

                                    <input type="text" value={pesquisa} onChange={(evento) =>
                                        setPesquisa(evento.target.value)
                                    } placeholder="Pesquisar conversas..." className="w-full bg-transparent py-3 text-sm text-[#493D32] outline-none placeholder:text-[#A79B8F]" />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {carregandoConversas ? (
                                    <p className="p-6 text-center text-sm text-[#94877A]">
                                        Carregando conversas...
                                    </p>
                                ) : erroChat ? (
                                    <p className="p-6 text-center text-sm text-red-600">
                                        {erroChat}
                                    </p>
                                ) : conversasFiltradas.length > 0 ? (
                                    conversasFiltradas.map((conversa) => (
                                        <button type="button" key={conversa.id} onClick={() =>
                                            abrirConversa(conversa.id)
                                        } className="flex w-full items-center gap-3 border-b border-[#F3EEE8] px-4 py-4 text-left transition hover:bg-[#FAF7F3]" >
                                            <div className="relative h-12 w-12 shrink-0">
                                                <AvatarUsuario nome={conversa.nome} src={obterUrlAvatar(
                                                    conversa.avatarPath
                                                )} className="h-full w-full" />

                                                {conversa.naoLidas > 0 && (
                                                    <span className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#A57849]" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center justify-between gap-2">
                                                    <h3 className="truncate text-sm font-semibold text-[#3D332B]">
                                                        {conversa.nome}
                                                    </h3>

                                                    <span className="shrink-0 text-[10px] text-[#9B8A78]">
                                                        {conversa.horario}
                                                    </span>
                                                </div>

                                                <p className="mb-1 truncate text-xs text-[#A57849]">
                                                    {conversa.imovel}
                                                </p>

                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="truncate text-xs text-[#94877A]">
                                                        {conversa.ultimaMensagem}
                                                    </p>

                                                    {conversa.naoLidas > 0 && (
                                                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#A57849] px-1.5 text-[10px] font-bold text-white">
                                                            {conversa.naoLidas}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="flex h-full min-h-48 flex-col items-center justify-center px-6 text-center">
                                        <Icons.IoIosChatbubbles size={36} className="mb-3 text-[#C4AA8F]" />

                                        <p className="text-sm font-semibold text-[#493D32]">
                                            Nenhuma conversa encontrada
                                        </p>

                                        <p className="mt-1 text-xs text-[#94877A]">
                                            Tente pesquisar outro nome ou imóvel.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <footer className="shrink-0 border-t border-[#F0E9E1] bg-[#FCFAF7] px-4 py-3">
                                <p className="text-center text-[11px] text-[#A49789]">
                                    Suas conversas · Easy Rent
                                </p>
                            </footer>
                        </>
                    )}

                    {conversaSelecionada && (
                        <>
                            <div className="flex shrink-0 items-center gap-2 border-b border-[#F0E9E1] bg-[#FCFAF7] px-4 py-2">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-medium text-[#A57849]">
                                        Imóvel relacionado
                                    </p>
                                    <p className="truncate text-xs text-[#77695C]">
                                        {conversaSelecionada.imovel}
                                    </p>
                                </div>
                            </div>

                            <div ref={areaMensagensRef} className="flex-1 space-y-3 overflow-y-auto bg-[#F8F5F0] px-3 py-4" style={{
                                backgroundImage:
                                    'radial-gradient(#E7DCCF 0.6px, transparent 0.6px)',
                                backgroundSize: '16px 16px',
                            }}
                            >
                                {carregandoMensagens && (
                                    <p className="text-center text-xs text-[#94877A]">
                                        Carregando mensagens...
                                    </p>
                                )}

                                {erroChat && (
                                    <p className="rounded-lg bg-red-50 p-2 text-center text-xs text-red-600">
                                        {erroChat}
                                    </p>
                                )}

                                <div className="mb-4 flex justify-center">
                                    <span className="rounded-lg bg-white/90 px-3 py-1.5 text-[10px] text-[#9A8A79] shadow-sm">
                                        Início da conversa
                                    </span>
                                </div>

                                {conversaSelecionada.mensagens.map((item) => (
                                    <div key={item.id} className={`flex ${item.enviada
                                        ? 'justify-end'
                                        : 'justify-start'
                                        }`} >
                                        <div className={`max-w-[84%] rounded-2xl px-3 py-2 shadow-sm ${item.enviada
                                            ? 'rounded-br-sm bg-[#E9D8C5] text-[#493727]'
                                            : 'rounded-bl-sm border border-[#EEE5DB] bg-white text-[#493D32]'
                                            }`}>

                                            <p className="whitespace-pre-wrap break-words text-sm leading-5">
                                                {item.texto}
                                            </p>

                                            <p className="mt-1 text-right text-[10px] text-[#998775]">
                                                {item.hora}
                                                {item.enviada && (
                                                    <span className="ml-1">
                                                        ✓
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <div ref={finalMensagensRef} className="h-px w-full" aria-hidden="true" />
                            </div>

                            <form onSubmit={enviarMensagem} className="flex shrink-0 items-end gap-2 border-t border-[#EDE4DA] bg-white p-3" >
                                <textarea rows={1} value={mensagem} onChange={(evento) =>
                                    setMensagem(evento.target.value)
                                } onKeyDown={(evento) => {
                                    if (
                                        evento.key === 'Enter' &&
                                        !evento.shiftKey
                                    ) {
                                        evento.preventDefault();
                                        evento.currentTarget.form?.requestSubmit();
                                    }
                                }} placeholder="Digite uma mensagem..." aria-label="Digite uma mensagem" className="max-h-24 min-h-10 flex-1 resize-none rounded-xl bg-[#F7F4F0] px-3 py-2.5 text-sm text-[#493D32] outline-none placeholder:text-[#A79B8F] focus:ring-1 focus:ring-[#C5A17B]" />

                                <button type="submit" disabled={!mensagem.trim() || enviando} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A57849] text-white transition hover:bg-[#8D653D] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Enviar mensagem" >
                                    <span className="text-lg">➤</span>
                                </button>
                            </form>
                        </>
                    )}
                </section>
            )}

            <button type="button" onClick={() => setChatAberto((aberto) => !aberto)} className="fixed bottom-6 right-6 z-[1001] flex h-14 w-14 items-center justify-center rounded-full bg-[#A57849] text-white shadow-[0_5px_20px_rgba(76,51,30,0.25)] transition duration-200 hover:scale-105 hover:bg-[#8D653D] active:scale-95" aria-label={chatAberto ? 'Fechar mensagens' : 'Abrir mensagens'} title="Mensagens" >
                {chatAberto ? (
                    <Icons.IoIosClose size={30} />
                ) : (
                    <>
                        <Icons.IoIosChatbubbles size={27} />

                        {totalNaoLidas > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#C44F3D] px-1 text-[10px] font-bold text-white">
                                {totalNaoLidas > 9 ? '9+' : totalNaoLidas}
                            </span>
                        )}
                    </>
                )}
            </button>
        </>
    );
};

export default Chat;