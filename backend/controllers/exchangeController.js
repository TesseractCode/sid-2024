require('dotenv').config();
const axios = require('axios');

exports.getExchangeRate = async (req, res) => {
  const { currency, date } = req.query; 
  try {

    const minDate = new Date('2005-01-03'); // Minimum allowed date
    const currentDate = new Date(); // Current date

    if (date) {
      const queryDate = new Date(date);

      if (queryDate < minDate) {
        return res.status(400).json({ error: 'Exchange rates are available starting from the 3rd of January 2005.' });
      }

      if (queryDate > currentDate) {
        return res.status(400).json({ error: 'Exchange rates for future dates are not available.' });
      }
    }


    const response = await axios.get(`https://api.openapi.ro/api/exchange/${currency}?${date}`, {
      headers: {
        'x-api-key': process.env.OPENAPI_KEY,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching exchange rate:', error.message);

    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data });
    }

    res.status(500).json({ error: 'An error occurred while fetching the exchange rate.' });
  }
};
