require('dotenv').config();
const axios = require('axios');

// Controller to search companies using the listafirme.ro API
exports.searchCompaniesFromListafirme = async (req, res) => {
  const { name } = req.query; 

  if (!name || name.length < 3) {
    return res.status(400).json({ error: 'Query must be at least 3 characters long.' });
  }

  try {
    const apiKey = process.env.LISTAFIRME_KEY;

    const apiUrl = `https://www.listafirme.ro/api/search-v1.asp?key=${apiKey}&src=${encodeURIComponent(name)}`;

    const response = await axios.get(apiUrl);

    const companies = response.data.Results.map(company => ({
      denumire: company.Name,
      judet: company.County,
      cif: company.FiscalCode,
    }));

    res.status(200).json({ companies });
  } catch (error) {
    console.error('Error fetching companies from listafirme:', error.message);

    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data });
    }

    res.status(500).json({ error: 'An error occurred while searching for companies.' });
  }
};
