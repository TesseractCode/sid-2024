const axios = require('axios');

async function get_company_contacts(company_name) {
    try {
        const response = await axios.post('http://localhost:5000/contact', {
            company_name: company_name,
        });

        // console.log('Phone Number:', response.data.phone_number);
        // console.log('Email       :', response.data.email);
        // console.log('Location    :', response.data.location);
        // console.log('Website     :', response.data.website);
        return response.data;
    } catch (error) {
        console.error('Error calling Python API:', error);
        return error;
    }
}

// get_company_contacts('VISMA');

module.exports = { get_company_contacts };
