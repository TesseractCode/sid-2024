const axios = require('axios');

async function get_company_description(company_name) {
    try {
        const response = await axios.post('http://localhost:5000/description', {
            company_name: company_name,
        });
        
        let result = response.data.description;
        // console.log('Description:', result);
        return result;
    } catch (error) {
        console.error('Error calling Python API:', error);
        return error;
    }
}

// get_company_description('VISMA');

module.exports = { get_company_description };
