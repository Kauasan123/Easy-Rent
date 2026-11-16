const asaasApi = require('./asaasService');

const obterOuCriarClienteAsaas = async (usuario, cpfCnpj, dadosFormulario = {}) => {
    const cpfLimpo = String(cpfCnpj || '').replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
        throw new Error('CPF inválido ou não informado.');
    }

    const nomeCompleto = [
        dadosFormulario.nome,
        dadosFormulario.sobrenome
    ]
        .filter(Boolean)
        .join(' ')
        .trim();

    const dadosCliente = {
        name: nomeCompleto || usuario.nome,
        cpfCnpj: cpfLimpo,
        email: dadosFormulario.email?.trim() || usuario.email,
        mobilePhone: String(dadosFormulario.telefone || '').replace(/\D/g, ''),
        externalReference: String(usuario.id)
    };

    if (dadosFormulario.cep) {
        dadosCliente.postalCode = dadosFormulario.cep;
    }

    if (dadosFormulario.rua) {
        dadosCliente.address = dadosFormulario.rua;
    }

    if (dadosFormulario.numero) {
        dadosCliente.addressNumber = dadosFormulario.numero;
    }

    if (dadosFormulario.bairro) {
        dadosCliente.province = dadosFormulario.bairro;
    }

    if (usuario.asaasCustomerId) {
        await asaasApi.put(
            `/customers/${usuario.asaasCustomerId}`,
            dadosCliente
        );

        return usuario.asaasCustomerId;
    }

    const consulta = await asaasApi.get('/customers', {
        params: {
            externalReference: String(usuario.id),
            limit: 1
        }
    });

    const clienteExistente = consulta.data.data?.[0];

    if (clienteExistente) {
        await asaasApi.put(
            `/customers/${clienteExistente.id}`,
            dadosCliente
        );

        return clienteExistente.id;
    }

    const resposta = await asaasApi.post(
        '/customers',
        dadosCliente
    );

    return resposta.data.id;
};

module.exports = {
    obterOuCriarClienteAsaas
};