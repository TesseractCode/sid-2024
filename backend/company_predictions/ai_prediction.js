const axios = require('axios');

async function get_company_prediction(company_name, cif) {
    try {
        const response = await axios.post('http://localhost:5000/ai_prediction', {
            company_name: company_name,
            cif: cif
        });
        
        let result = response.data.ai_prediction
        // console.log('Response from Python:', result);
        return result;
    } catch (error) {
        console.error('Error calling Python API:', error);
        return error;
    }
}

// get_company_prediction('La Doi Pasi', 15600976);

module.exports = { get_company_prediction };
