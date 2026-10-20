import { useEffect, useState } from 'react';

const CORES = [
    { fundo: '#E8D8C5', texto: '#755638' },
    { fundo: '#D7E5D4', texto: '#416344' },
    { fundo: '#D9E3F0', texto: '#405C83' },
    { fundo: '#F0D9E1', texto: '#99546C' },
    { fundo: '#E6DDF2', texto: '#71558E' },
    { fundo: '#F2E6BE', texto: '#826C24' },
    { fundo: '#D1E9E8', texto: '#347473' },
    { fundo: '#E8D9D0', texto: '#805C4B' }
];

function obterIniciais(nome) {
    const palavras = (nome || 'Usuário')
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (palavras.length === 0) return 'U';

    if (palavras.length === 1) {
        return palavras[0].substring(0, 2).toUpperCase();
    }

    return (
        palavras[0][0] +
        palavras[palavras.length - 1][0]
    ).toUpperCase();
}

function obterCor(nome) {
    const texto = (nome || 'Usuário').toLowerCase();

    let hash = 0;

    for (let i = 0; i < texto.length; i++) {
        hash = texto.charCodeAt(i) + ((hash << 5) - hash);
    }

    const indice = Math.abs(hash) % CORES.length;

    return CORES[indice];
}

export default function AvatarUsuario({
    nome,
    src,
    className = 'h-10 w-10',
    textoClassName = 'text-base'
}) {
    const [erroImagem, setErroImagem] = useState(false);

    useEffect(() => {
        setErroImagem(false);
    }, [src]);

    const mostrarFoto = Boolean(src) && !erroImagem;
    const cor = obterCor(nome);

    return (
        <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`} style={!mostrarFoto ? { backgroundColor: cor.fundo } : undefined} >
            {mostrarFoto ? (
                <img src={src} alt={`Foto de ${nome || 'usuário'}`} className="h-full w-full object-cover" onError={() => setErroImagem(true)} />
            ) : (
                <span className={`select-none font-bold ${textoClassName}`} style={{ color: cor.texto }} >
                    {obterIniciais(nome)}
                </span>
            )}
        </div>
    );
}