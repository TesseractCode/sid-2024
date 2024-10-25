require('dotenv').config();
const supabase = require('../supabase/supabase-client');

exports.compareCompanyToSector = async (req, res) => {
    const { cif } = req.query;

    if (!cif) {
        return res.status(400).json({ error: 'CIF is required.' });
    }

    try {
        // Step 1: Fetch the CAEN code from the companies table using CIF
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

        // Step 2: Fetch all CIFs with the same CAEN code from the companies table
        const { data: sectorCompanies, error: sectorCompaniesError } = await supabase
            .from('companies')
            .select('cif')
            .eq('caen_code', caen);

        if (sectorCompaniesError || !sectorCompanies || sectorCompanies.length === 0) {
            console.error('Error fetching sector companies:', sectorCompaniesError?.message || 'No companies found.');
            return res.status(404).json({ error: 'No companies found for the provided CAEN code.' });
        }

        // Log how many companies it found in the same sector
        const totalSectorCompanies = sectorCompanies.length;
        console.log(`Found ${totalSectorCompanies} companies in the same CAEN sector.`);

        // Extract CIFs from the companies with the same CAEN code
        const sectorCIFs = sectorCompanies.map(company => company.cif);

        // Step 3: Fetch the company indicators for all CIFs with the same CAEN code for the year 2023
        const { data: sectorData, error: sectorError } = await supabase
            .from('company_indicators')
            .select('i13, i14, i16, i18, i20') // Select the relevant indicators
            .in('cif', sectorCIFs) // Use the list of CIFs
            .eq('year', 2023); // Fetch data for the year 2023 only

        if (sectorError || !sectorData || sectorData.length === 0) {
            console.error('Error fetching sector data:', sectorError?.message || 'No data found for sector.');
            return res.status(404).json({ error: 'No data found for the provided CAEN code in 2023.' });
        }

        // Step 4: Calculate sector averages
        const sectorAverages = sectorData.reduce(
            (acc, company) => {
                acc.total_turnover += company.i13 || 0;
                acc.total_revenue += company.i14 || 0;
                acc.total_gross_profit += company.i16 || 0;
                acc.total_net_profit += company.i18 || 0;
                acc.total_employees += company.i20 || 0;
                acc.count += 1;
                return acc;
            },
            { total_turnover: 0, total_revenue: 0, total_gross_profit: 0, total_net_profit: 0, total_employees: 0, count: 0 }
        );

        const sectorAveragesCalculated = {
            avg_turnover: sectorAverages.total_turnover / sectorAverages.count,
            avg_total_revenue: sectorAverages.total_revenue / sectorAverages.count,
            avg_gross_profit: sectorAverages.total_gross_profit / sectorAverages.count,
            avg_net_profit: sectorAverages.total_net_profit / sectorAverages.count,
            avg_employees: sectorAverages.total_employees / sectorAverages.count,
        };

        // Step 5: Fetch the company indicators for the provided CIF for the year 2023 only
        const { data: companyIndicators, error: companyError } = await supabase
            .from('company_indicators')
            .select('i13, i14, i16, i18, i20') // Fetch the same indicators for the company
            .eq('cif', cif)
            .eq('year', 2023) // Ensure it's only for the year 2023
            .single(); // Expect only one row for this company for 2023

        if (companyError || !companyIndicators) {
            console.error('Error fetching company indicators:', companyError?.message || 'No data found.');
            return res.status(404).json({ error: 'Company indicators not found for 2023.' });
        }

        // Step 6: Calculate differences and percentage differences for the year 2023
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

        // Step 7: Calculate averages and medians of differences and percentage differences
        const avgDifference = (
            differences.turnover_diff +
            differences.total_revenue_diff +
            differences.gross_profit_diff +
            differences.net_profit_diff +
            differences.employees_diff
        ) / 5;

        const avgPercentageDifference = (
            percentageDifferences.turnover_diff_percentage +
            percentageDifferences.total_revenue_diff_percentage +
            percentageDifferences.gross_profit_diff_percentage +
            percentageDifferences.net_profit_diff_percentage +
            percentageDifferences.employees_diff_percentage
        ) / 5;

        const diffArray = Object.values(differences);
        const percentageDiffArray = Object.values(percentageDifferences);

        const median = (arr) => {
            const sorted = arr.slice().sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        };

        const medianDifference = median(diffArray);
        const medianPercentageDifference = median(percentageDiffArray);

        // Step 8: Return the comparison data
        res.status(200).json({
            total_companies_in_sector: totalSectorCompanies,
            sector_averages: sectorAveragesCalculated,
            company_indicators: {
                year: 2023,
                indicators: companyIndicators,
            },
            differences: differences,
            percentage_differences: percentageDifferences,
            average_difference: avgDifference,
            average_percentage_difference: avgPercentageDifference,
            median_difference: medianDifference,
            median_percentage_difference: medianPercentageDifference,
        });

    } catch (error) {
        console.error('Error in comparison:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
