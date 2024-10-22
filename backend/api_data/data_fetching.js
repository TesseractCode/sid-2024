require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.ANAF_API_KEY;
const endpoint = 'https://api.openapi.ro/api/companies/{cif}/balances';

const fetchData = async(cif) => {
    try {
        const response = await axios.get(endpoint.replace('{cif}', cif), {
            headers: {
                'x-api-key': `${apiKey}`,
            },
        });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

module.exports = { fetchData };
