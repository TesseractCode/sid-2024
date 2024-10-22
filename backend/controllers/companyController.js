require('dotenv').config();
const axios = require('axios');

exports.searchCompanies = async (req, res) => {
  const { q, judet, include_radiata } = req.body;

  // Validate input
  if (!q || q.length < 3) {
    return res.status(400).json({ error: 'Query must be at least 3 characters long.' });
  }

  try {
    // Prepare request body data
    const requestData = { q };
    if (judet) requestData.judet = judet;
    if (include_radiata !== undefined) requestData.include_radiata = include_radiata;


    // Make API request to OpenAPI.ro using POST method
    const response = await axios.post('https://api.openapi.ro/v1/companies/search', requestData, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.OPENAPI_KEY, // Include API key in the headers
      },
    });

    // Extract necessary data
    const companies = response.data.data.map((company) => ({
      denumire: company.denumire,
      judet: company.judet,
      cif: company.cif,
    }));

    // Send the data back to the client
    res.status(200).json({ companies });
  } catch (error) {
    console.error('Error searching companies:', error.message);

    if (error.response) {
      // API returned an error response
      res.status(error.response.status).json({ error: error.response.data.message });
    } else {
      // Other errors (network issues, etc.)
      res.status(500).json({ error: 'An error occurred while searching for companies.' });
    }
  }
};
