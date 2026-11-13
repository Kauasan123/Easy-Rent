const asaasApi = require('./asaasService');

const obterOuCriarClienteAsaas = async (usuario, cpfCnpj) => {
    if (usuario.asaasCustomerId) {
        return usuario.asaasCustomerId;
    }

    const cpfLimpo = String(cpfCnpj || '').replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
        throw new Error('CPF inválido ou não informado.');
    }

    const externalReference = String(usuario.id);

    const consulta = await asaasApi.get('/customers', {
        params: {
            externalReference,
            limit: 1
        }
    });

    const clienteExistente = consulta.data.data?.[0];

    if (clienteExistente) {
        return clienteExistente.id;
    }

    const dadosCliente = {
        name: usuario.nome,
        cpfCnpj: cpfLimpo,
        email: usuario.email,
        externalReference
    };

    const resposta = await asaasApi.post(
        '/customers',
        dadosCliente
    );

    return resposta.data.id;
};

module.exports = {
    obterOuCriarClienteAsaas
};