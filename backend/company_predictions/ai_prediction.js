const axios = require('axios');

async function get_company_prediction(company_name, cif) {
    try {
        const response = await axios.post('http://localhost:5000/ai_prediction', {
            company_name: company_name,
            cif: cif
        });

        console.log('Response from Python:', response.data.ai_prediction);
    } catch (error) {
        console.error('Error calling Python API:', error);
    }
}

// get_company_prediction('La Doi Pasi', 15600976);

module.exports = { get_company_prediction };
