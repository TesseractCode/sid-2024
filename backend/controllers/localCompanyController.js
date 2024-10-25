const supabase = require('../supabase/supabase-client');
const axios = require('axios');

exports.fuzzySearchCompanies = async (req, res) => {
  const { query } = req.query;

  if (!query || query.length < 3) {
    return res.status(400).json({ error: 'Query must be at least 3 characters long.' });
  }

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('cif, company_name, county') 
      .ilike('company_name', `%${query}%`);

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      console.log('No records found in local DB. Fetching from OpenAPI...');
      const apiResponse = await searchCompaniesFromOpenApi(query);

      if (apiResponse.error) {
        return res.status(500).json({ error: 'Error fetching from external API.' });
      }

      return res.status(200).json({ companies: apiResponse.companies });
    }

    return res.status(200).json({ companies: data });
  } catch (error) {
    console.error('Error during fuzzy search:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const searchCompaniesFromOpenApi = async (searchQuery) => {
    try {
      const requestData = {
        q: searchQuery,
      };
  
      const response = await axios.post('https://api.openapi.ro/v1/companies/search', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.OPENAPI_KEY,
        },
      });
  
      const companies = response.data.data.map((company) => ({
        cif: parseInt(company.cif, 10),
        company_name: company.denumire,
        county: company.judet,
      }));
  
      return { companies };
    } catch (error) {
      console.error('Error fetching from OpenAPI:', error.message);
      return { error: 'Error fetching from OpenAPI' };
    }
}

exports.searchCompanyByCifPreview = async (req, res) => {
  const { cif } = req.params;

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('cif', cif);

    if (error) {
      throw error;
    }

    console.log(data)

    if (data.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.status(200).json({ company: data[0] });
  } catch (error) {
    console.error('Error during CIF search:', error.message);
    res.status(500).json({ error: 'An error occurred while searching for the company' });
  }
};


exports.getCompanyByCifExtended = async (req, res) => {
  const { cif } = req.params;

  try {
    console.log(`Fetching company data for CIF: ${cif}`);

    // Fetch company details from 'companies' table
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('cif', cif)
      .single();

    if (companyError) {
      console.error('Error fetching company data:', companyError);
      return res.status(404).json({ error: 'Company not found' });
    }

    console.log('Company data fetched:', companyData);

    // Fetch company indicators from 'company_indicators' table
    const { data: indicatorsData, error: indicatorsError } = await supabase
      .from('company_indicators')
      .select(`
        year, 
        i1, i2, i3, i4, i5, i6, i7, i8, i9, i10, i11, i12, i13, i14, i15, 
        i16, i17, i18, i19, i20
      `)
      .eq('cif', cif);

    if (indicatorsError) {
      console.error('Error fetching company indicators:', indicatorsError);
      return res.status(500).json({ error: 'Error fetching company indicators' });
    }

    console.log('Company indicators fetched:', indicatorsData);

    // Group indicators by year
    const indicatorsByYear = indicatorsData.map(indicator => ({
      year: indicator.year,
      indicators: {
        active_imobilizate_total: indicator.i1,
        active_circulante_total: indicator.i2,
        stocuri: indicator.i3,
        creante: indicator.i4,
        casa_si_conturi: indicator.i5,
        cheltuieli_in_avans: indicator.i6,
        datorii: indicator.i7,
        venituri_in_avans: indicator.i8,
        provizioane: indicator.i9,
        capitaluri_total: indicator.i10,
        capital_subscris_varsat: indicator.i11,
        patrimoniul_regiei: indicator.i12,
        cifra_de_afaceri_neta: indicator.i13,
        venituri_totale: indicator.i14,
        cheltuieli_totale: indicator.i15,
        profit_brut: indicator.i16,
        pierdere_bruta: indicator.i17,
        profit_net: indicator.i18,
        pierdere_neta: indicator.i19,
        numar_mediu_de_salariati: indicator.i20
      }
    }));

    console.log('Transformed indicators data:', indicatorsByYear);

    // Send response with company info and indicators
    res.status(200).json({
      company: {
        cif: companyData.cif,
        company_name: companyData.company_name,
        county: companyData.county
      },
      indicators: indicatorsByYear
    });
  } catch (error) {
    console.error('Unexpected error while fetching company data:', error);
    res.status(500).json({ error: 'An unexpected error occurred while fetching the data' });
  }
};
