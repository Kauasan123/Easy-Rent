const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

    const kaua = await prisma.usuario.upsert({
        where: { email: 'Exemploteste@gmail.com' },
        update: {},
        create: { nome: 'Kauã Santos', email: 'Exemploteste@gmail.com', senha: '1234', telefone: '53 999999999' }
    });

    const ana = await prisma.usuario.upsert({
        where: { email: 'ana.silva@gmail.com' },
        update: {},
        create: { nome: 'Ana Silva', email: 'ana.silva@gmail.com', senha: '1234', telefone: '51 988887777' }
    });

    const carlos = await prisma.usuario.upsert({
        where: { email: 'carlos.souza@gmail.com' },
        update: {},
        create: { nome: 'Carlos Souza', email: 'carlos.souza@gmail.com', senha: '1234', telefone: '54 977776666' }
    });

    const mariana = await prisma.usuario.upsert({
        where: { email: 'mariana.costa@gmail.com' },
        update: {},
        create: { nome: 'Mariana Costa', email: 'mariana.costa@gmail.com', senha: '1234', telefone: '51 966665555' }
    });

    const lucas = await prisma.usuario.upsert({
        where: { email: 'lucas.pereira@gmail.com' },
        update: {},
        create: { nome: 'Lucas Pereira', email: 'lucas.pereira@gmail.com', senha: '1234', telefone: '53 955554444' }
    });

    const dadosImoveis = [
        {
            titulo: 'Casa do Laranjal', tipo: 'casa', cidade: 'Pelotas', bairro: 'Laranjal', preco: 250, capacidade: '3+ Pessoas',
            hasWifi: true, hasPiscina: true, aceitaPets: true, quartos: 3, banheiros: 2, vagas: 2,
            usuarioId: kaua.id,
            imagens: [
                'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
                'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600',
                'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600',
            ]
        },
        {
            titulo: 'Apartamento Centro', tipo: 'apartamento', cidade: 'Pelotas', bairro: 'Centro', preco: 180, capacidade: '2 Pessoas',
            hasWifi: true, hasArCondicionado: true, quartos: 1, banheiros: 1, vagas: 1,
            usuarioId: ana.id,
            imagens: [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
            ]
        },
        {
            titulo: 'Casa Gramado', tipo: 'casa', cidade: 'Gramado', bairro: 'Centro', preco: 850, capacidade: '3+ Pessoas',
            hasWifi: true, hasPiscina: true, hasEstacionamento: true, quartos: 4, banheiros: 3, vagas: 3,
            usuarioId: ana.id,
            imagens: [
                'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
            ]
        },
        {
            titulo: 'Apto Canela', tipo: 'apartamento', cidade: 'Canela', bairro: 'Centro', preco: 320, capacidade: '2 Pessoas',
            hasWifi: true, hasTv: true, quartos: 2, banheiros: 1, vagas: 1,
            usuarioId: carlos.id,
            imagens: [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600',
                'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600',
            ]
        },
        {
            titulo: 'Casa Praia Torres', tipo: 'casa', cidade: 'Torres', bairro: 'Prainha', preco: 500, capacidade: '3+ Pessoas',
            hasPiscina: true, proximoPraia: true, aceitaPets: true, quartos: 3, banheiros: 2, vagas: 2,
            usuarioId: carlos.id,
            imagens: [
                'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600',
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
                'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600',
            ]
        },
        {
            titulo: 'Cobertura Luxo', tipo: 'apartamento', cidade: 'Porto Alegre', bairro: 'Moinhos', preco: 1200, capacidade: '3+ Pessoas',
            hasWifi: true, hasArCondicionado: true, hasElevador: true, hasPortaria24h: true, quartos: 4, banheiros: 3, vagas: 2,
            usuarioId: mariana.id,
            imagens: [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
                'https://images.unsplash.com/photo-1551361415-69c87624334f?w=600',
                'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=600',
            ]
        },
        {
            titulo: 'Casa Simples', tipo: 'casa', cidade: 'Pelotas', bairro: 'Três Vendas', preco: 120, capacidade: '1 Pessoa',
            quartos: 1, banheiros: 1, vagas: 1,
            usuarioId: mariana.id,
            imagens: [
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
                'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=600',
                'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600',
            ]
        },
        {
            titulo: 'Flat Moderno', tipo: 'apartamento', cidade: 'Porto Alegre', bairro: 'Bom Fim', preco: 400, capacidade: '2 Pessoas',
            hasWifi: true, hasTv: true, hasArCondicionado: true, quartos: 1, banheiros: 1, vagas: 1,
            usuarioId: lucas.id,
            imagens: [
                'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600',
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600',
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600',
            ]
        },
    ];

    const imoveisCriados = [];
    for (const dados of dadosImoveis) {
        const imovel = await prisma.imovel.create({
            data: {
                titulo: dados.titulo,
                tipo: dados.tipo,
                descricao: `Descrição do imóvel ${dados.titulo}. Ótima localização, confortável e bem equipado.`,
                cidade: dados.cidade,
                bairro: dados.bairro,
                endereco: 'Rua Teste, 123',
                cep: '96000-000',
                preco: dados.preco,
                tipoCobranca: 'noite',
                capacidade: dados.capacidade,
                quartos: dados.quartos,
                banheiros: dados.banheiros,
                vagas: dados.vagas,
                proximoCentro: dados.proximoCentro || false,
                proximoPraia: dados.proximoPraia || false,
                hasWifi: dados.hasWifi || false,
                hasMaquinaLavar: dados.hasMaquinaLavar || false,
                hasArCondicionado: dados.hasArCondicionado || false,
                hasChurrascaria: dados.hasChurrascaria || false,
                hasEstacionamento: dados.hasEstacionamento || false,
                hasElevador: dados.hasElevador || false,
                hasPiscina: dados.hasPiscina || false,
                hasPortaria24h: dados.hasPortaria24h || false,
                hasTv: dados.hasTv || false,
                aceitaPets: dados.aceitaPets || false,
                permiteFestas: dados.permiteFestas || false,
                acessibilidade: dados.acessibilidade || false,
                naoFumante: dados.naoFumante || false,
                usuarioId: dados.usuarioId,
                imagens: { create: dados.imagens.map(url => ({ url })) },
                periodos: {
                    create: [
                        { inicio: new Date('2026-06-10'), fim: new Date('2026-06-20') },
                        { inicio: new Date('2026-07-01'), fim: new Date('2026-07-31') },
                    ]
                }
            }
        });
        imoveisCriados.push(imovel);
    }

    const reservasData = [
        { imovelId: imoveisCriados[0].id, hospedeId: ana.id },
        { imovelId: imoveisCriados[0].id, hospedeId: carlos.id },
        { imovelId: imoveisCriados[1].id, hospedeId: kaua.id },
        { imovelId: imoveisCriados[1].id, hospedeId: lucas.id },
        { imovelId: imoveisCriados[2].id, hospedeId: mariana.id },
        { imovelId: imoveisCriados[3].id, hospedeId: kaua.id },
        { imovelId: imoveisCriados[4].id, hospedeId: ana.id },
        { imovelId: imoveisCriados[5].id, hospedeId: kaua.id },
        { imovelId: imoveisCriados[5].id, hospedeId: carlos.id },
        { imovelId: imoveisCriados[6].id, hospedeId: lucas.id },
        { imovelId: imoveisCriados[7].id, hospedeId: ana.id },
        { imovelId: imoveisCriados[7].id, hospedeId: mariana.id },
    ];

    const reservasCriadas = [];
    for (const dados of reservasData) {
        const reserva = await prisma.reserva.create({
            data: {
                inicio: new Date('2026-05-01'),
                fim: new Date('2026-05-07'),
                status: 'Confirmada',
                imovelId: dados.imovelId,
                hospedeId: dados.hospedeId
            }
        });
        reservasCriadas.push({ ...reserva, hospedeId: dados.hospedeId });
    }

    const comentarios = [
        "Lugar incrível! Muito confortável e bem localizado. Recomendo demais!",
        "Ótima experiência, o anfitrião foi muito atencioso e o espaço superou as expectativas.",
        "Perfeito para relaxar. Voltarei com certeza na próxima oportunidade!",
        "Tudo exatamente como nas fotos. Limpeza impecável e boa estrutura.",
        "Adorei a estadia! O lugar é lindo e muito bem equipado.",
        "Experiência incrível, superou todas as minhas expectativas.",
        "Ótima localização, perto de tudo. O imóvel é muito agradável.",
        "Recomendo muito! Lugar aconchegante e acolhedor.",
        "Muito bom! A piscina fez toda a diferença na viagem.",
        "Anfitrião excelente, respondeu rapidinho e foi super prestativo.",
        "Imóvel muito bem conservado e com todas as comodidades necessárias.",
        "Passamos dias incríveis aqui. Com certeza voltaremos!"
    ];

    const notas = [5, 5, 4.5, 5, 4, 5, 4.5, 5, 4, 5, 4.5, 5];

    for (let i = 0; i < reservasCriadas.length; i++) {
        const reserva = reservasCriadas[i];
        await prisma.avaliacao.create({
            data: {
                nota: notas[i],
                comentario: comentarios[i],
                imovelId: reserva.imovelId,
                autorId: reserva.hospedeId
            }
        });
    }

    console.log('✅ Seed concluído!');
    console.log(`👤 5 usuários criados`);
    console.log(`🏠 8 imóveis criados e distribuídos entre os usuários`);
    console.log(`📅 ${reservasCriadas.length} reservas confirmadas criadas`);
    console.log(`⭐ ${reservasCriadas.length} avaliações criadas`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());