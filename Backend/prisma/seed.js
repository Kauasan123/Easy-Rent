const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const usuario = await prisma.usuario.upsert({
        where: { email: 'Exemploteste@gmail.com' },
        update: {},
        create: {
            nome: 'Kauã Santos',
            email: 'Exemploteste@gmail.com',
            senha: '1234',
            telefone: '53 999999999'
        }
    });

    const imoveis = [
        {
            titulo: 'Casa do Laranjal', tipo: 'casa', cidade: 'Pelotas', bairro: 'Laranjal', preco: 250, capacidade: '3+ Pessoas',
            hasWifi: true, hasPiscina: true, aceitaPets: true, quartos: 3, banheiros: 2, vagas: 2,
            imagens: [
                'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
                'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600',
                'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600',
            ]
        },
        {
            titulo: 'Apartamento Centro', tipo: 'apartamento', cidade: 'Pelotas', bairro: 'Centro', preco: 180, capacidade: '2 Pessoas',
            hasWifi: true, hasArCondicionado: true, quartos: 1, banheiros: 1, vagas: 1,
            imagens: [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
            ]
        },
        {
            titulo: 'Casa Gramado', tipo: 'casa', cidade: 'Gramado', bairro: 'Centro', preco: 850, capacidade: '3+ Pessoas',
            hasWifi: true, hasPiscina: true, hasEstacionamento: true, quartos: 4, banheiros: 3, vagas: 3,
            imagens: [
                'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
            ]
        },
        {
            titulo: 'Apto Canela', tipo: 'apartamento', cidade: 'Canela', bairro: 'Centro', preco: 320, capacidade: '2 Pessoas',
            hasWifi: true, hasTv: true, quartos: 2, banheiros: 1, vagas: 1,
            imagens: [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600',
                'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600',
            ]
        },
        {
            titulo: 'Casa Praia Torres', tipo: 'casa', cidade: 'Torres', bairro: 'Prainha', preco: 500, capacidade: '3+ Pessoas',
            hasPiscina: true, proximoPraia: true, aceitaPets: true, quartos: 3, banheiros: 2, vagas: 2,
            imagens: [
                'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600',
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
                'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600',
            ]
        },
        {
            titulo: 'Cobertura Luxo', tipo: 'apartamento', cidade: 'Porto Alegre', bairro: 'Moinhos', preco: 1200, capacidade: '3+ Pessoas',
            hasWifi: true, hasArCondicionado: true, hasElevador: true, hasPortaria24h: true, quartos: 4, banheiros: 3, vagas: 2,
            imagens: [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
                'https://images.unsplash.com/photo-1551361415-69c87624334f?w=600',
                'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=600',
            ]
        },
        {
            titulo: 'Casa Simples', tipo: 'casa', cidade: 'Pelotas', bairro: 'Três Vendas', preco: 120, capacidade: '1 Pessoa',
            quartos: 1, banheiros: 1, vagas: 1,
            imagens: [
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
                'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=600',
                'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600',
            ]
        },
        {
            titulo: 'Flat Moderno', tipo: 'apartamento', cidade: 'Porto Alegre', bairro: 'Bom Fim', preco: 400, capacidade: '2 Pessoas',
            hasWifi: true, hasTv: true, hasArCondicionado: true, quartos: 1, banheiros: 1, vagas: 1,
            imagens: [
                'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600',
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600',
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600',
            ]
        },
    ];

    for (const dados of imoveis) {
        await prisma.imovel.create({
            data: {
                titulo: dados.titulo,
                tipo: dados.tipo,
                descricao: `Descrição do imóvel ${dados.titulo}`,
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
                usuarioId: usuario.id,
                imagens: {
                    create: dados.imagens.map(url => ({ url }))
                },
                periodos: {
                    create: [
                        { inicio: new Date('2026-06-10'), fim: new Date('2026-06-20') },
                        { inicio: new Date('2026-07-01'), fim: new Date('2026-07-31') },
                    ]
                }
            }
        });
    }

    console.log('✅ Seed concluído! 8 imóveis criados com imagens.');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());