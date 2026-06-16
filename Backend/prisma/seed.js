const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

    // ==================== USUÁRIOS ====================
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
    const fernanda = await prisma.usuario.upsert({
        where: { email: 'fernanda.lima@gmail.com' },
        update: {},
        create: { nome: 'Fernanda Lima', email: 'fernanda.lima@gmail.com', senha: '1234', telefone: '51 944443333' }
    });
    const roberto = await prisma.usuario.upsert({
        where: { email: 'roberto.alves@gmail.com' },
        update: {},
        create: { nome: 'Roberto Alves', email: 'roberto.alves@gmail.com', senha: '1234', telefone: '54 933332222' }
    });

    // ==================== IMÓVEIS ====================
    const dadosImoveis = [
        {
            titulo: 'Casa do Laranjal', tipo: 'casa', cidade: 'Pelotas', bairro: 'Laranjal', preco: 250, capacidade: '3+ Pessoas',
            hasWifi: true, hasPiscina: true, aceitaPets: true, hasChurrascaria: true, quartos: 3, banheiros: 2, vagas: 2,
            usuarioId: kaua.id,
            periodos: [
                { inicio: new Date('2026-06-10'), fim: new Date('2026-06-20') },
                { inicio: new Date('2026-07-15'), fim: new Date('2026-07-30') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
                'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600',
                'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600',
            ]
        },
        {
            titulo: 'Apartamento Centro Pelotas', tipo: 'apartamento', cidade: 'Pelotas', bairro: 'Centro', preco: 180, capacidade: '2 Pessoas',
            hasWifi: true, hasArCondicionado: true, hasTv: true, quartos: 1, banheiros: 1, vagas: 1,
            usuarioId: ana.id,
            periodos: [
                { inicio: new Date('2026-06-05'), fim: new Date('2026-06-15') },
                { inicio: new Date('2026-08-01'), fim: new Date('2026-08-20') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
            ]
        },
        {
            titulo: 'Casa Gramado', tipo: 'casa', cidade: 'Gramado', bairro: 'Centro', preco: 850, capacidade: '3+ Pessoas',
            hasWifi: true, hasPiscina: true, hasEstacionamento: true, hasChurrascaria: true, quartos: 4, banheiros: 3, vagas: 3,
            usuarioId: ana.id,
            periodos: [
                { inicio: new Date('2026-06-20'), fim: new Date('2026-06-30') },
                { inicio: new Date('2026-07-10'), fim: new Date('2026-07-25') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
            ]
        },
        {
            titulo: 'Apto Canela', tipo: 'apartamento', cidade: 'Canela', bairro: 'Centro', preco: 320, capacidade: '2 Pessoas',
            hasWifi: true, hasTv: true, hasArCondicionado: true, quartos: 2, banheiros: 1, vagas: 1,
            usuarioId: carlos.id,
            periodos: [
                { inicio: new Date('2026-07-01'), fim: new Date('2026-07-15') },
                { inicio: new Date('2026-08-10'), fim: new Date('2026-08-25') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600',
                'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600',
            ]
        },
        {
            titulo: 'Casa Praia Torres', tipo: 'casa', cidade: 'Torres', bairro: 'Prainha', preco: 500, capacidade: '3+ Pessoas',
            hasPiscina: true, proximoPraia: true, aceitaPets: true, hasChurrascaria: true, quartos: 3, banheiros: 2, vagas: 2,
            usuarioId: carlos.id,
            periodos: [
                { inicio: new Date('2026-06-15'), fim: new Date('2026-06-28') },
                { inicio: new Date('2026-07-20'), fim: new Date('2026-08-05') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600',
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
                'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600',
            ]
        },
        {
            titulo: 'Cobertura Luxo Porto Alegre', tipo: 'apartamento', cidade: 'Porto Alegre', bairro: 'Moinhos', preco: 1200, capacidade: '3+ Pessoas',
            hasWifi: true, hasArCondicionado: true, hasElevador: true, hasPortaria24h: true, hasTv: true, quartos: 4, banheiros: 3, vagas: 2,
            usuarioId: mariana.id,
            periodos: [
                { inicio: new Date('2026-06-01'), fim: new Date('2026-06-12') },
                { inicio: new Date('2026-07-05'), fim: new Date('2026-07-20') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
                'https://images.unsplash.com/photo-1551361415-69c87624334f?w=600',
                'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=600',
            ]
        },
        {
            titulo: 'Casa Simples Pelotas', tipo: 'casa', cidade: 'Pelotas', bairro: 'Três Vendas', preco: 120, capacidade: '1 Pessoa',
            quartos: 1, banheiros: 1, vagas: 1,
            usuarioId: mariana.id,
            periodos: [
                { inicio: new Date('2026-06-10'), fim: new Date('2026-07-10') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=600',
                'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=600',
                'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600',
            ]
        },
        {
            titulo: 'Flat Moderno Bom Fim', tipo: 'apartamento', cidade: 'Porto Alegre', bairro: 'Bom Fim', preco: 400, capacidade: '2 Pessoas',
            hasWifi: true, hasTv: true, hasArCondicionado: true, quartos: 1, banheiros: 1, vagas: 1,
            usuarioId: lucas.id,
            periodos: [
                { inicio: new Date('2026-06-25'), fim: new Date('2026-07-05') },
                { inicio: new Date('2026-08-15'), fim: new Date('2026-08-30') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600',
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600',
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600',
            ]
        },
        {
            titulo: 'Casa de Campo Caxias', tipo: 'casa', cidade: 'Caxias do Sul', bairro: 'Ana Rech', preco: 380, capacidade: '3+ Pessoas',
            hasWifi: true, hasChurrascaria: true, hasEstacionamento: true, aceitaPets: true, quartos: 3, banheiros: 2, vagas: 3,
            usuarioId: fernanda.id,
            periodos: [
                { inicio: new Date('2026-06-10'), fim: new Date('2026-06-25') },
                { inicio: new Date('2026-07-15'), fim: new Date('2026-08-10') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600',
                'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=600',
                'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=600',
            ]
        },
        {
            titulo: 'Apartamento Beira Mar', tipo: 'apartamento', cidade: 'Tramandaí', bairro: 'Centro', preco: 290, capacidade: '2 Pessoas',
            hasWifi: true, proximoPraia: true, hasTv: true, hasArCondicionado: true, quartos: 2, banheiros: 1, vagas: 1,
            usuarioId: fernanda.id,
            periodos: [
                { inicio: new Date('2026-06-20'), fim: new Date('2026-07-10') },
                { inicio: new Date('2026-08-01'), fim: new Date('2026-08-25') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600',
                'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=600',
                'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600',
            ]
        },
        {
            titulo: 'Casa Colonial Porto Alegre', tipo: 'casa', cidade: 'Porto Alegre', bairro: 'Petrópolis', preco: 650, capacidade: '3+ Pessoas',
            hasWifi: true, hasArCondicionado: true, hasEstacionamento: true, hasPiscina: true, permiteFestas: true, quartos: 4, banheiros: 2, vagas: 2,
            usuarioId: roberto.id,
            periodos: [
                { inicio: new Date('2026-06-05'), fim: new Date('2026-06-18') },
                { inicio: new Date('2026-07-01'), fim: new Date('2026-07-20') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600',
                'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600',
                'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600',
            ]
        },
        {
            titulo: 'Studio Moderno Moinhos', tipo: 'apartamento', cidade: 'Porto Alegre', bairro: 'Moinhos', preco: 220, capacidade: '1 Pessoa',
            hasWifi: true, hasArCondicionado: true, hasElevador: true, hasPortaria24h: true, quartos: 1, banheiros: 1, vagas: 1,
            usuarioId: roberto.id,
            periodos: [
                { inicio: new Date('2026-06-01'), fim: new Date('2026-06-30') },
                { inicio: new Date('2026-08-01'), fim: new Date('2026-08-31') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600',
                'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600',
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
            ]
        },
        {
            titulo: 'Casa com Piscina Capão', tipo: 'casa', cidade: 'Capão da Canoa', bairro: 'Centro', preco: 420, capacidade: '3+ Pessoas',
            hasWifi: true, hasPiscina: true, aceitaPets: true, hasChurrascaria: true, proximoPraia: true, quartos: 3, banheiros: 2, vagas: 2,
            usuarioId: kaua.id,
            periodos: [
                { inicio: new Date('2026-06-15'), fim: new Date('2026-07-05') },
                { inicio: new Date('2026-07-20'), fim: new Date('2026-08-10') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
                'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600',
            ]
        },
        {
            titulo: 'Chalé Serra Gaúcha', tipo: 'casa', cidade: 'Bento Gonçalves', bairro: 'Centro', preco: 560, capacidade: '2 Pessoas',
            hasWifi: true, hasChurrascaria: true, hasEstacionamento: true, naoFumante: true, quartos: 2, banheiros: 1, vagas: 2,
            usuarioId: lucas.id,
            periodos: [
                { inicio: new Date('2026-06-10'), fim: new Date('2026-06-22') },
                { inicio: new Date('2026-07-10'), fim: new Date('2026-07-28') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600',
                'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600',
                'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600',
            ]
        },
        {
            titulo: 'Apartamento Novo Hamburgo', tipo: 'apartamento', cidade: 'Novo Hamburgo', bairro: 'Centro', preco: 160, capacidade: '2 Pessoas',
            hasWifi: true, hasTv: true, hasMaquinaLavar: true, quartos: 2, banheiros: 1, vagas: 1,
            usuarioId: carlos.id,
            periodos: [
                { inicio: new Date('2026-06-01'), fim: new Date('2026-06-20') },
                { inicio: new Date('2026-07-05'), fim: new Date('2026-07-25') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600',
                'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600',
                'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600',
            ]
        },
        {
            titulo: 'Casa Luxo Guarujá', tipo: 'casa', cidade: 'Santa Maria', bairro: 'Centro', preco: 750, capacidade: '3+ Pessoas',
            hasWifi: true, hasPiscina: true, hasArCondicionado: true, hasChurrascaria: true, hasEstacionamento: true, acessibilidade: true, quartos: 4, banheiros: 3, vagas: 3,
            usuarioId: ana.id,
            periodos: [
                { inicio: new Date('2026-06-08'), fim: new Date('2026-06-22') },
                { inicio: new Date('2026-07-12'), fim: new Date('2026-07-30') },
            ],
            imagens: [
                'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600',
                'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=600',
                'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=600',
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
                    create: dados.periodos.map(p => ({
                        inicio: p.inicio,
                        fim: p.fim
                    }))
                }
            }
        });
        imoveisCriados.push(imovel);
    }

    // ==================== RESERVAS ====================
    const reservasData = [
        { imovelId: imoveisCriados[0].id, hospedeId: ana.id },
        { imovelId: imoveisCriados[0].id, hospedeId: carlos.id },
        { imovelId: imoveisCriados[1].id, hospedeId: kaua.id },
        { imovelId: imoveisCriados[1].id, hospedeId: lucas.id },
        { imovelId: imoveisCriados[2].id, hospedeId: mariana.id },
        { imovelId: imoveisCriados[2].id, hospedeId: fernanda.id },
        { imovelId: imoveisCriados[3].id, hospedeId: kaua.id },
        { imovelId: imoveisCriados[4].id, hospedeId: ana.id },
        { imovelId: imoveisCriados[5].id, hospedeId: kaua.id },
        { imovelId: imoveisCriados[5].id, hospedeId: carlos.id },
        { imovelId: imoveisCriados[6].id, hospedeId: lucas.id },
        { imovelId: imoveisCriados[7].id, hospedeId: ana.id },
        { imovelId: imoveisCriados[7].id, hospedeId: mariana.id },
        { imovelId: imoveisCriados[8].id, hospedeId: roberto.id },
        { imovelId: imoveisCriados[9].id, hospedeId: kaua.id },
        { imovelId: imoveisCriados[10].id, hospedeId: lucas.id },
        { imovelId: imoveisCriados[11].id, hospedeId: fernanda.id },
        { imovelId: imoveisCriados[12].id, hospedeId: carlos.id },
        { imovelId: imoveisCriados[13].id, hospedeId: ana.id },
        { imovelId: imoveisCriados[14].id, hospedeId: roberto.id },
        { imovelId: imoveisCriados[15].id, hospedeId: mariana.id },
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

    // ==================== AVALIAÇÕES ====================
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
        "Passamos dias incríveis aqui. Com certeza voltaremos!",
        "O chalé é simplesmente perfeito para o clima da serra. Adorei!",
        "Apartamento super limpo e bem localizado. Ótimo custo-benefício.",
        "Casa espaçosa e acolhedora, perfeita para a família.",
        "Melhor experiência de hospedagem que já tive. Voltarei com certeza!",
        "Estrutura impecável, vista incrível e muito conforto.",
        "Excelente para quem busca tranquilidade e bom atendimento.",
        "Piscina incrível e espaço muito bem cuidado. Recomendo!",
        "Flat moderno com tudo que precisamos. Localização perfeita.",
        "Casa linda com ótima infraestrutura. Superou expectativas!",
    ];

    const notas = [5, 5, 4.5, 5, 4, 4.5, 5, 4.5, 5, 4, 5, 4.5, 5, 4, 5, 4.5, 5, 4, 4.5, 5, 4.5];

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
    console.log(`👤 7 usuários criados`);
    console.log(`🏠 16 imóveis criados e distribuídos entre os usuários`);
    console.log(`📅 ${reservasCriadas.length} reservas confirmadas criadas`);
    console.log(`⭐ ${reservasCriadas.length} avaliações criadas`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());