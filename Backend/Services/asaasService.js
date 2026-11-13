const axios = require('axios');

const asaasApi = axios.create({
    baseURL: process.env.ASAAS_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'access_token': process.env.ASAAS_API_KEY,
        'User-Agent': 'EasyRent/1.0.0'
    }
});

module.exports = asaasApi;