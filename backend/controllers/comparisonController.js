require('dotenv').config();
const supabase = require('../supabase/supabase-client');

exports.compareCompanyToSector = async (req, res) => {
    const { cif } = req.query;

    if (!cif) {
        return res.status(400).json({ error: 'CIF is required.' });
    }

    try {
        const { data: companyData, error: companyDataError } = await supabase
            .from('companies')
            .select('caen_code')
            .eq('cif', cif)
            .single();

        if (companyDataError || !companyData) {
            console.error('Error fetching company data:', companyDataError?.message || 'No data found.');
            return res.status(404).json({ error: 'Company not found or CAEN code missing.' });
        }

        const caen = companyData.caen_code;

        const { data: sectorCompanies, error: sectorCompaniesError } = await supabase
            .from('companies')
            .select('cif')
            .eq('caen_code', caen);

        if (sectorCompaniesError || !sectorCompanies || sectorCompanies.length === 0) {
            console.error('Error fetching sector companies:', sectorCompaniesError?.message || 'No companies found.');
            return res.status(404).json({ error: 'No companies found for the provided CAEN code.' });
        }

        const sectorCIFs = sectorCompanies.map(company => company.cif);

        const { data: sectorData, error: sectorError } = await supabase
            .from('company_indicators')
            .select('i13, i14, i16, i18, i20') 
            .in('cif', sectorCIFs)
            .eq('year', 2023)
            .gt('i20', 1);

        if (sectorError || !sectorData || sectorData.length === 0) {
            console.error('Error fetching sector data:', sectorError?.message || 'No data found for sector.');
            return res.status(404).json({ error: 'No data found for the provided CAEN code in 2023.' });
        }

        const totalCompaniesInSector = sectorData.length;
        console.log(`Found ${totalCompaniesInSector} companies in the same CAEN sector with more than 1 employee.`);

        const sectorAverages = sectorData.reduce(
            (acc, company) => {
                acc.total_turnover += company.i13 || 0;
                acc.total_revenue += company.i14 || 0;
                acc.total_gross_profit += company.i16 || 0;
                acc.total_net_profit += company.i18 || 0;
                acc.total_employees += company.i20 || 0;
                return acc;
            },
            { total_turnover: 0, total_revenue: 0, total_gross_profit: 0, total_net_profit: 0, total_employees: 0 }
        );

        const sectorAveragesCalculated = {
            avg_turnover: sectorAverages.total_turnover / totalCompaniesInSector,
            avg_total_revenue: sectorAverages.total_revenue / totalCompaniesInSector,
            avg_gross_profit: sectorAverages.total_gross_profit / totalCompaniesInSector,
            avg_net_profit: sectorAverages.total_net_profit / totalCompaniesInSector,
            avg_employees: sectorAverages.total_employees / totalCompaniesInSector,
        };

        const { data: companyIndicators, error: companyError } = await supabase
            .from('company_indicators')
            .select('i13, i14, i16, i18, i20')
            .eq('cif', cif)
            .eq('year', 2023)
            .single();

        if (companyError || !companyIndicators) {
            console.error('Error fetching company indicators:', companyError?.message || 'No data found.');
            return res.status(404).json({ error: 'Company indicators not found for 2023.' });
        }

        const differences = {
            turnover_diff: companyIndicators.i13 - sectorAveragesCalculated.avg_turnover,
            total_revenue_diff: companyIndicators.i14 - sectorAveragesCalculated.avg_total_revenue,
            gross_profit_diff: companyIndicators.i16 - sectorAveragesCalculated.avg_gross_profit,
            net_profit_diff: companyIndicators.i18 - sectorAveragesCalculated.avg_net_profit,
            employees_diff: companyIndicators.i20 - sectorAveragesCalculated.avg_employees,
        };

        const percentageDifferences = {
            turnover_diff_percentage: (differences.turnover_diff / sectorAveragesCalculated.avg_turnover) * 100,
            total_revenue_diff_percentage: (differences.total_revenue_diff / sectorAveragesCalculated.avg_total_revenue) * 100,
            gross_profit_diff_percentage: (differences.gross_profit_diff / sectorAveragesCalculated.avg_gross_profit) * 100,
            net_profit_diff_percentage: (differences.net_profit_diff / sectorAveragesCalculated.avg_net_profit) * 100,
            employees_diff_percentage: (differences.employees_diff / sectorAveragesCalculated.avg_employees) * 100,
        };

        res.status(200).json({
            total_companies_in_sector: totalCompaniesInSector,
            sector_averages: sectorAveragesCalculated,
            company_indicators: {
                year: 2023,
                indicators: companyIndicators,
            },
            differences: differences,
            percentage_differences: percentageDifferences
        });

    } catch (error) {
        console.error('Error in comparison:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
