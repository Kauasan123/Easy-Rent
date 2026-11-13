
require('dotenv').config();

const asaasApi = require('./Services/asaasService');

async function testarPix() {
    const pagamentoId = 'pay_0_nh12t4tf4w4i9m';
    const chaveId = '4abd912c-afaa-4f02-bb10-7c6a1936be51';

    try {
        console.log('Consultando cobrança existente...');

        const respostaPagamento = await asaasApi.get(
            `/payments/${pagamentoId}`
        );

        const pagamento = respostaPagamento.data;

        console.log('\nDADOS DA COBRANÇA');
        console.log('ID:', pagamento.id);
        console.log('Tipo:', pagamento.billingType);
        console.log('Status:', pagamento.status);
        console.log('Valor:', pagamento.value);
        console.log('Criada em:', pagamento.dateCreated);

        console.log('\nCONSULTANDO CHAVE PIX...');

        const respostaChave = await asaasApi.get(
            `/pix/addressKeys/${chaveId}`
        );

        const chave = respostaChave.data;

        console.log('ID:', chave.id);
        console.log('Tipo:', chave.type);
        console.log('Status:', chave.status);
        console.log('Criada em:', chave.dateCreated);

        console.log('\nTENTANDO OBTER QR CODE...');

        const respostaPix = await asaasApi.get(
            `/payments/${pagamentoId}/pixQrCode`
        );

        console.log('QR Code obtido!');
        console.log(
            'Imagem disponível:',
            Boolean(respostaPix.data.encodedImage)
        );
        console.log(
            'Copia e cola disponível:',
            Boolean(respostaPix.data.payload)
        );

    } catch (error) {
        console.error('\nERRO NA CONSULTA:');
        console.error('Mensagem:', error.message);
        console.error('Resposta:', error.response?.data);
        console.error('Status:', error.response?.status);
    }
}

testarPix();