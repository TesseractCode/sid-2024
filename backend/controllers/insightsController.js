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

exports.findSimilarCompanies = async (req, res) => {
    const { cif } = req.query;

    if (!cif) {
        return res.status(400).json({ error: 'CIF is required.' });
    }

    try {
        // Step 1: Fetch the target company by CIF
        const { data: targetCompany, error: targetCompanyError } = await supabase
            .from('companies')
            .select('caen_code, cif')
            .eq('cif', cif)
            .single();

        if (targetCompanyError || !targetCompany) {
            console.error('Error fetching target company:', targetCompanyError?.message || 'No data found.');
            return res.status(404).json({ error: 'Company not found.' });
        }

        const caen = targetCompany.caen_code;

        // Step 2: Fetch indicators for the target company for the last year (2023)
        const { data: targetIndicators, error: targetIndicatorsError } = await supabase
            .from('company_indicators')
            .select('i13, i14, i16, i18, i20') // Turnover, Revenue, Gross Profit, Net Profit, Employees
            .eq('cif', cif)
            .eq('year', 2023)
            .single();

        if (targetIndicatorsError || !targetIndicators) {
            console.error('Error fetching target company indicators:', targetIndicatorsError?.message || 'No data found.');
            return res.status(404).json({ error: 'Company indicators not found for 2023.' });
        }

        // Step 3: Fetch companies with the same CAEN code (or similar)
        const { data: similarCompanies, error: similarCompaniesError } = await supabase
            .from('companies')
            .select('cif, company_name')
            .eq('caen_code', caen);

        if (similarCompaniesError || !similarCompanies || similarCompanies.length === 0) {
            console.error('Error fetching similar companies:', similarCompaniesError?.message || 'No data found.');
            return res.status(404).json({ error: 'No similar companies found.' });
        }

        const similarCIFs = similarCompanies.map(company => company.cif);

        // Step 4: Fetch indicators for the similar companies for 2023, excluding companies with 0 or 1 employees
        const { data: similarIndicators, error: similarIndicatorsError } = await supabase
            .from('company_indicators')
            .select('cif, i13, i14, i16, i18, i20') // Turnover, Revenue, Gross Profit, Net Profit, Employees
            .in('cif', similarCIFs)
            .eq('year', 2023)
            .gt('i20', 1); // Exclude companies with 0 or 1 employees

        if (similarIndicatorsError || !similarIndicators || similarIndicators.length === 0) {
            console.error('Error fetching similar companies indicators:', similarIndicatorsError?.message || 'No data found.');
            return res.status(404).json({ error: 'No data found for similar companies.' });
        }

        // Step 5: Compute similarity scores based on differences in profit, employees, and turnover
        const computeSimilarity = (target, candidate) => {
            const profitDiff = Math.abs(target.i18 - candidate.i18);
            const employeesDiff = Math.abs(target.i20 - candidate.i20);
            const turnoverDiff = Math.abs(target.i13 - candidate.i13);

            // Calculate the total differences
            const maxProfit = Math.max(1, target.i18, candidate.i18);  // To avoid division by zero
            const maxEmployees = Math.max(1, target.i20, candidate.i20);
            const maxTurnover = Math.max(1, target.i13, candidate.i13);

            // Compute similarity score (0 to 1 scale)
            const normalizedScore = (
                (profitDiff / maxProfit) +
                (employeesDiff / maxEmployees) +
                (turnoverDiff / maxTurnover)
            ) / 3; // Average of the normalized differences

            // Convert to a 0-100 scale and return as integer
            const scaledScore = Math.round((1 - normalizedScore) * 100); // Subtract from 1 to get similarity instead of difference

            return scaledScore;
        };

        let rankedCompanies = similarIndicators.map(company => ({
            cif: company.cif,
            company_name: similarCompanies.find(c => c.cif === company.cif).company_name,
            similarity_score: computeSimilarity(targetIndicators, company),
            indicators: {
                turnover: company.i13,
                total_revenue: company.i14,
                gross_profit: company.i16,
                net_profit: company.i18,
                employees: company.i20
            }
        }));

        // Step 6: Remove the target company from the list
        rankedCompanies = rankedCompanies.filter(company => company.cif !== parseInt(cif));

        // Step 7: Sort by similarity score (ascending) and return the top 4 companies
        const topSimilarCompanies = rankedCompanies
            .sort((a, b) => b.similarity_score - a.similarity_score) // Descending order (most similar first)
            .slice(0, 4); // Top 4 most similar companies

        // Step 8: Return the result
        res.status(200).json({
            target_company: {
                cif: targetCompany.cif,
                indicators: targetIndicators
            },
            similar_companies: topSimilarCompanies
        });

    } catch (error) {
        console.error('Error finding similar companies:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.companyRiskAssessment = async (req, res) => {
    const { cif } = req.query;

    if (!cif) {
        return res.status(400).json({ error: 'CIF is required.' });
    }

    try {
        // Step 1: Fetch historical indicators for the company
        const { data: historicalIndicators, error: indicatorsError } = await supabase
            .from('company_indicators')
            .select('year, i7, i10, i13, i14, i16, i18, i20') // Select Debt (i7), Equity (i10), Revenue (i13, i14), Profit (i16, i18), Employees (i20)
            .eq('cif', cif)
            .order('year', { ascending: true });

        if (indicatorsError || !historicalIndicators || historicalIndicators.length === 0) {
            console.error('Error fetching company indicators:', indicatorsError?.message || 'No data found.');
            return res.status(404).json({ error: 'Company indicators not found.' });
        }

        // Step 2: Calculate Financial Ratios and Trends for Risk Assessment
        let totalYears = historicalIndicators.length;
        let totalDebtToEquity = 0;
        let totalProfitMargin = 0;
        let totalRevenueGrowth = 0;
        let totalProfitGrowth = 0;
        let totalEmployeeGrowth = 0;
        let previousRevenue = null;
        let previousProfit = null;
        let previousEmployees = null;
        let volatilityCount = 0;

        historicalIndicators.forEach((yearData, index) => {
            const { i7: debt, i10: equity, i13: revenue, i14: totalRevenue, i18: netProfit, i20: employees } = yearData;

            // Calculate debt-to-equity ratio
            if (equity > 0) {
                const debtToEquity = debt / equity;
                totalDebtToEquity += debtToEquity;
            }

            // Calculate profit margin
            if (totalRevenue > 0) {
                const profitMargin = (netProfit / totalRevenue) * 100;
                totalProfitMargin += profitMargin;
            }

            // Revenue growth calculation
            if (previousRevenue !== null && revenue > 0) {
                const revenueGrowth = ((revenue - previousRevenue) / previousRevenue) * 100;
                totalRevenueGrowth += revenueGrowth;
            }

            // Profit growth calculation
            if (previousProfit !== null && netProfit > 0) {
                const profitGrowth = ((netProfit - previousProfit) / previousProfit) * 100;
                totalProfitGrowth += profitGrowth;
            }

            // Employee growth calculation
            if (previousEmployees !== null && employees > 0) {
                const employeeGrowth = ((employees - previousEmployees) / previousEmployees) * 100;
                totalEmployeeGrowth += employeeGrowth;
            }

            // Volatility check (high fluctuations in profit margins)
            if (index > 0 && netProfit > 0 && previousProfit > 0) {
                const volatility = Math.abs((netProfit - previousProfit) / previousProfit) * 100;
                if (volatility > 20) { // Consider 20% change as volatile
                    volatilityCount++;
                }
            }

            previousRevenue = revenue;
            previousProfit = netProfit;
            previousEmployees = employees;
        });

        // Step 3: Calculate averages over the years
        const averageDebtToEquity = totalDebtToEquity / totalYears;
        const averageProfitMargin = totalProfitMargin / totalYears;
        const averageRevenueGrowth = totalRevenueGrowth / (totalYears - 1);
        const averageProfitGrowth = totalProfitGrowth / (totalYears - 1);
        const averageEmployeeGrowth = totalEmployeeGrowth / (totalYears - 1);

        // Step 4: Determine risk based on thresholds
        let riskScore = 0;
        const riskAssessment = [];

        if (averageDebtToEquity > 2) {
            riskScore += 20; // Higher risk due to high debt
            riskAssessment.push('High debt-to-equity ratio');
        }
        if (averageProfitMargin < 5) {
            riskScore += 20; // Low profitability
            riskAssessment.push('Low profit margin');
        }
        if (averageRevenueGrowth < 0) {
            riskScore += 20; // Declining revenue
            riskAssessment.push('Negative revenue growth');
        }
        if (averageProfitGrowth < 0) {
            riskScore += 20; // Declining profit
            riskAssessment.push('Negative profit growth');
        }
        if (volatilityCount > 2) {
            riskScore += 20; // High volatility in profits
            riskAssessment.push('High profit volatility');
        }

        // Normalize the risk score to a 0-100 scale (max risk = 100)
        riskScore = Math.min(100, riskScore);

        // Step 5: Return the risk assessment
        res.status(200).json({
            company_cif: cif,
            risk_score: riskScore,
            risk_factors: riskAssessment,
            metrics: {
                averageDebtToEquity,
                averageProfitMargin,
                averageRevenueGrowth,
                averageProfitGrowth,
                averageEmployeeGrowth,
                profitVolatilityCount: volatilityCount
            }
        });

    } catch (error) {
        console.error('Error performing risk assessment:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};