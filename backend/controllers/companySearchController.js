const supabase = require('../supabase/supabase-client');
const axios = require('axios');

// Fuzzy search controller function using company_name_search column
exports.fuzzySearchCompanies = async (req, res) => {
  const { query } = req.query;

  // Validate the search query
  if (!query || query.length < 3) {
    return res.status(400).json({ error: 'Query must be at least 3 characters long.' });
  }

  try {
    // Perform the search using the company_name_search column
    const { data, error } = await supabase
      .from('companies')
      .select('cif, company_name, county') // Only select the required columns
      .ilike('company_name', `%${query}%`); // Use ilike for flexible, case-insensitive matching

    if (error) {
      throw new Error(error.message);
    }

    // If no records are found, call the secondary OpenAPI search
    if (data.length === 0) {
      console.log('No records found in local DB. Fetching from OpenAPI...');
      const apiResponse = await searchCompaniesFromOpenApi(query);

      if (apiResponse.error) {
        return res.status(500).json({ error: 'Error fetching from external API.' });
      }

      return res.status(200).json({ companies: apiResponse.companies });
    }

    // Return the matching companies
    return res.status(200).json({ companies: data });
  } catch (error) {
    console.error('Error during fuzzy search:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Function to search companies using OpenAPI when no results are found locally
const searchCompaniesFromOpenApi = async (searchQuery) => {
    try {
      const requestData = {
        q: searchQuery, // The search term
      };
  
      const response = await axios.post('https://api.openapi.ro/v1/companies/search', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.OPENAPI_KEY,
        },
      });
  
      // Map the results from OpenAPI to match our internal data structure
      const companies = response.data.data.map((company) => ({
        cif: parseInt(company.cif, 10), // Cast cif to integer
        company_name: company.denumire,
        county: company.judet,
      }));
  
      return { companies };
    } catch (error) {
      console.error('Error fetching from OpenAPI:', error.message);
      return { error: 'Error fetching from OpenAPI' };
    }
  }

