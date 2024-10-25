'use client';
import { MultiLineChart } from "@/components/ui/multi-line-chart";
import { SingleLineChart } from "@/components/ui/single-line-chart";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress"; // Import the Progress component from Shadcn

interface CompanyIndicator {
  year: number;
  indicators: {
    active_imobilizate_total: number;
    active_circulante_total: number;
    stocuri: number;
    creante: number;
    casa_si_conturi: number;
    cheltuieli_in_avans: number;
    datorii: number;
    venituri_in_avans: number;
    provizioane: number;
    capitaluri_total: number;
    capital_subscris_varsat: number;
    cifra_de_afaceri_neta: number;
    venituri_totale: number;
    cheltuieli_totale: number;
    profit_brut: number;
    pierdere_bruta: number;
    profit_net: number;
    pierdere_neta: number;
    numar_mediu_de_salariati: number;
  };
}

interface APIResponse {
  company: {
    cif: number;
    company_name: string;
    county: string;
  };
  indicators: CompanyIndicator[];
}

interface SimilarCompany {
    cif: number;
    company_name: string;
    similarity_score: number;
    indicators: {
      turnover: number;
      total_revenue: number;
      gross_profit: number;
      net_profit: number;
      employees: number;
    };
  }
  

interface SectorData {
    total_companies_in_sector: number;
    sector_averages: {
      avg_turnover: number;
      avg_total_revenue: number;
      avg_gross_profit: number;
      avg_net_profit: number;
      avg_employees: number;
    };
    company_indicators: {
      year: number;
      indicators: CompanyIndicator['indicators'];
    };
    differences: {
      turnover_diff: number;
      total_revenue_diff: number;
      gross_profit_diff: number;
      net_profit_diff: number;
      employees_diff: number;
    };
    percentage_differences: {
      turnover_diff_percentage: number;
      total_revenue_diff_percentage: number;
      gross_profit_diff_percentage: number;
      net_profit_diff_percentage: number;
      employees_diff_percentage: number;
    };
  }

function Page() {
  const searchParams = useSearchParams();
  const [companyIndicators, setCompanyIndicators] = useState<CompanyIndicator[]>([]);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [prev, setPrev] = useState<any>(null);
  const [cif, setCif] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<any>(null);
  const [sectorData, setSectorData] = useState<SectorData | null>(null);
  const [similarCompanies, setSimilarCompanies] = useState<SimilarCompany[] | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  const [description, setDescription] = useState<string | undefined>(undefined);

  
  const queryCif = searchParams.get("cif");
  const queryCompanyName = searchParams.get("company_name");


  const fetchRiskAssessment = async (cif: string | null) => {
    if (!cif) return;
  
    try {
      const response = await fetch(`http://localhost:3000/api/company-risk-assessment?cif=${cif}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        setRiskAssessment(data); // Store the risk assessment data
      } else {
        console.error('Error fetching risk assessment');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchSimilarCompanies = async (cif: string | null) => {
    if (!cif) return;
  
    try {
      const response = await fetch(`http://localhost:3000/api/find-similar-companies?cif=${cif}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        setSimilarCompanies(data.similar_companies); // Store the similar companies data
      } else {
        console.error('Error fetching similar companies');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchSectorData = async (cif: string | null) => {
    if (!cif) return;

    try {
      const response = await fetch(`http://localhost:3000/api/compare-company-sector?cif=${cif}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data: SectorData = await response.json();
        setSectorData(data); // Store the sector data
      } else {
        console.error('Error fetching sector data');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const fetchCompanyIndicators = async (cif: string | null) => {
    if (!cif) return;

    try {
      const response = await fetch(`http://localhost:3000/api/company/${cif}/extended-indicators`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if required
      });

      if (response.ok) {
        const data: APIResponse = await response.json();
        setCompanyIndicators(data.indicators); // Set the indicators array
        setCompanyName(data.company.company_name);
        setCif(data.company.cif.toString()); // Set the company name and CIF from the API response
      } else {
        console.error('Error fetching company indicators');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const fetchCAEN = async (cif: string | null) => {
    if (!cif) return;

    try {
      const response = await fetch(`http://localhost:3000/api/company/${cif}/preview-indicators`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if required
      });

      if (response.ok) {
        const data: APIResponse = await response.json();
        setPrev(data)
      } else {
        console.error('Error fetching company indicators');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  const fetchDescription = async (companyName: string | null) => {
    if (!companyName) return 'No company name provided';
  
    try {
      const response = await fetch(`http://localhost:3000/public/description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_name: companyName }),
      });
  
      if (response.ok) {
        const data = await response.text(); // Since the backend returns a string
        return data;
      } else {
        console.error('Error fetching company description');
        return 'Error fetching description';
      }
    } catch (error) {
      console.error('Fetch error:', error);
      return 'Fetch error';
    }
  };
  
  
  // Usage in your component (inside useEffect or another relevant part)
  useEffect(() => {
    const getDescription = async () => {
      const desc = await fetchDescription(queryCompanyName); // Replace queryCompanyName with the actual company name
      setDescription(desc);
    };
  
    getDescription();
  }, [queryCompanyName]);
  

  // UseEffect to trigger the fetch
  useEffect(() => {
    fetchCompanyIndicators(queryCif);
    fetchCAEN(queryCif);
    fetchSectorData(queryCif);
    fetchSimilarCompanies(queryCif);
    fetchRiskAssessment(queryCif);
  }, [queryCif]);

  

  if (companyIndicators.length === 0) {
    return <div>Loading data...</div>;
  }

  // Map the data from companyIndicators to charts
  const data1 = companyIndicators.map(item => ({ year: item.year, value: item.indicators.active_imobilizate_total }));
  const data2 = companyIndicators.map(item => ({ year: item.year, value: item.indicators.active_circulante_total }));
  const data13 = companyIndicators.map(item => ({ year: item.year, value: item.indicators.cifra_de_afaceri_neta }));
  const data18 = companyIndicators.map(item => ({ year: item.year, value: item.indicators.profit_net }));
  const data19 = companyIndicators.map(item => ({ year: item.year, value: item.indicators.pierdere_neta }));
  const data16 = companyIndicators.map(item => ({ year: item.year, value: item.indicators.profit_brut }));
  const data17 = companyIndicators.map(item => ({ year: item.year, value: item.indicators.pierdere_bruta }));
  const data14 = companyIndicators.map(item => ({ year: item.year, value: item.indicators.venituri_totale }));
  const data15 = companyIndicators.map(item => ({ year: item.year, value: item.indicators.cheltuieli_totale }));
  const data6 = companyIndicators.map(item => ({ year: item.year, value: item.indicators.cheltuieli_in_avans }));
  const data8 = companyIndicators.map(item => ({ year: item.year, value: item.indicators.venituri_in_avans }));
  const data20 = companyIndicators.map(item => ({ year: item.year, value: item.indicators.numar_mediu_de_salariati }));

  return (
    <div className="space-y-8 mt-8 mb-8">
      <header className="flex text-3xl font-bold">
        {queryCompanyName}
      </header>

      <div className=" mt-8 ml-auto mr-auto flex flex-col space-y-4">
                    
        <p><strong>Nume Companie:</strong> {prev.company.company_name}</p>
        <p><strong>Code CAEN:</strong> {prev.company.caen_code}</p>
        <p><strong>Descriere CAEN:</strong> {prev.company.caen_description}</p>
        <p><strong>Judet:</strong> {prev.company.county}</p>
        <p><strong>CIF:</strong> {prev.company.cif}</p>
        {/* {description} */}
        </div>

      <SingleLineChart
        title="Cifra de afaceri neta"
        description={`${companyName} cu CIF ${cif}`}
        data1={data13}
        label1="Cifra de afaceri neta "
      />
      <MultiLineChart
        title="Profit net si Pierdere neta"
        description={`${companyName} cu CIF ${cif}`}
        data1={data18}
        data2={data19}
        label1="Profit net "
        label2="Pierdere neta "
      />
      <MultiLineChart
        title="Profit brut si Pierdere bruta"
        description={`${companyName} cu CIF ${cif}`}
        data1={data16}
        data2={data17}
        label1="Profit brut "
        label2="Pierdere bruta "
      />
      <MultiLineChart
        title="Venituri totale si Cheltuieli totale"
        description={`${companyName} cu CIF ${cif}`}
        data1={data14}
        data2={data15}
        label1="Venituri totale "
        label2="Cheltuieli totale "
      />
      <MultiLineChart
        title="Venituri in avans si Cheltuieli in avans"
        description={`${companyName} cu CIF ${cif}`}
        data1={data6}
        data2={data8}
        label1="Venituri in avans "
        label2="Cheltuieli in avans "
      />
      <SingleLineChart
        title="Numar mediu de salariati"
        description={`${companyName} cu CIF ${cif}`}
        data1={data20}
        label1="Numar mediu de salariati "
      />
      <Table>
        <TableHeader>
          Alte informatii declarate
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead>Capitaluri - Total</TableHead>
            <TableHead>Active Imobilizate</TableHead>
            <TableHead>Active Circulante</TableHead>
            <TableHead>Stocuri</TableHead>
            <TableHead>Casa si conturi la banci</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companyIndicators.map((item) => (
            <TableRow key={item.year}>
              <TableCell className="font-medium">{item.year}</TableCell>
              <TableCell>{item.indicators.capitaluri_total}</TableCell>
              <TableCell>{item.indicators.active_imobilizate_total}</TableCell>
              <TableCell>{item.indicators.active_circulante_total}</TableCell>
              <TableCell>{item.indicators.stocuri}</TableCell>
              <TableCell>{item.indicators.casa_si_conturi}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {sectorData && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold">Comparatie pe Sector</h2>
          <p><strong>Code CAEN:</strong> {prev.company.caen_code}</p>
            <p><strong>Descriere CAEN:</strong> {prev.company.caen_description}</p>

          <div>
            <p className="mb-2">Turnover Difference: {sectorData.percentage_differences.turnover_diff_percentage.toFixed(2)}%</p>
            <Progress value={sectorData.percentage_differences.turnover_diff_percentage} className="w-full" />
          </div>

          <div>
            <p className="mb-2">Total Revenue Difference: {sectorData.percentage_differences.total_revenue_diff_percentage.toFixed(2)}%</p>
            <Progress value={sectorData.percentage_differences.total_revenue_diff_percentage} className="w-full" />
          </div>

          <div>
            <p className="mb-2">Gross Profit Difference: {sectorData.percentage_differences.gross_profit_diff_percentage.toFixed(2)}%</p>
            <Progress value={sectorData.percentage_differences.gross_profit_diff_percentage} className="w-full" />
          </div>

          <div>
            <p className="mb-2">Net Profit Difference: {sectorData.percentage_differences.net_profit_diff_percentage.toFixed(2)}%</p>
            <Progress value={sectorData.percentage_differences.net_profit_diff_percentage} className="w-full" />
          </div>

          <div>
            <p className="mb-2">Employees Difference: {sectorData.percentage_differences.employees_diff_percentage.toFixed(2)}%</p>
            <Progress value={sectorData.percentage_differences.employees_diff_percentage} className="w-full" />
          </div>
        </div>
      )}
      {similarCompanies && (
  <div className="space-y-4 mt-8">
    <h2 className="text-xl font-semibold">Similar Companies</h2>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company Name</TableHead>
          <TableHead>Turnover</TableHead>
          <TableHead>Net Profit</TableHead>
          <TableHead>Employees</TableHead>
          <TableHead>Similarity Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {similarCompanies.map((company) => (
          <TableRow key={company.cif}>
            <TableCell>{company.company_name}</TableCell>
            <TableCell>{company.indicators.turnover}</TableCell>
            <TableCell>{company.indicators.net_profit}</TableCell>
            <TableCell>{company.indicators.employees}</TableCell>
            <TableCell>{company.similarity_score}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)}
{riskAssessment && (
  <div className="space-y-4 mt-8">
    <h2 className="text-xl font-semibold">Risk Assessment</h2>
    <p>Risk Score: {riskAssessment.risk_score}</p>
    <ul>
      {riskAssessment.risk_factors.map((factor: any, index: any) => (
        <li key={index}>- {factor}</li>
      ))}
    </ul>
    <div className="mt-4 space-y-4">
    <h3 className="text-lg font-semibold">Metrics</h3>

    {/* Average Debt to Equity (no progress bar since it's not a percentage) */}
    <p>
        Average Debt to Equity: {riskAssessment.metrics.averageDebtToEquity !== null
        ? riskAssessment.metrics.averageDebtToEquity.toFixed(2)
        : 'NO DATA'}
    </p>

    {/* Average Profit Margin */}
    <p className="mb-2">
        Average Profit Margin: {riskAssessment.metrics.averageProfitMargin !== null
        ? `${riskAssessment.metrics.averageProfitMargin.toFixed(2)}%`
        : 'NO DATA'}
    </p>
    {riskAssessment.metrics.averageProfitMargin !== null && (
        <Progress value={Math.min(riskAssessment.metrics.averageProfitMargin, 100)} className="w-full" />
    )}

    {/* Average Revenue Growth */}
    <p className="mb-2">
        Average Revenue Growth: {riskAssessment.metrics.averageRevenueGrowth !== null
        ? `${riskAssessment.metrics.averageRevenueGrowth.toFixed(2)}%`
        : 'NO DATA'}
    </p>
    {riskAssessment.metrics.averageRevenueGrowth !== null && (
        <Progress value={Math.min(riskAssessment.metrics.averageRevenueGrowth, 100)} className="w-full" />
    )}

    {/* Average Profit Growth */}
    <p className="mb-2">
        Average Profit Growth: {riskAssessment.metrics.averageProfitGrowth !== null
        ? `${riskAssessment.metrics.averageProfitGrowth.toFixed(2)}%`
        : 'NO DATA'}
    </p>
    {riskAssessment.metrics.averageProfitGrowth !== null && (
        <Progress value={Math.min(riskAssessment.metrics.averageProfitGrowth, 100)} className="w-full" />
    )}

    {/* Average Employee Growth */}
    <p className="mb-2">
        Average Employee Growth: {riskAssessment.metrics.averageEmployeeGrowth !== null
        ? `${riskAssessment.metrics.averageEmployeeGrowth.toFixed(2)}%`
        : 'NO DATA'}
    </p>
    {riskAssessment.metrics.averageEmployeeGrowth !== null && (
        <Progress value={Math.min(riskAssessment.metrics.averageEmployeeGrowth, 100)} className="w-full" />
    )}

    {/* Profit Volatility Count (assuming this is not a percentage) */}
    <p>
        Profit Volatility Count: {riskAssessment.metrics.profitVolatilityCount !== null
        ? riskAssessment.metrics.profitVolatilityCount
        : 'NO DATA'}
    </p>
</div>


  </div>
)}

      <footer className="w-full pt-12 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} TesseractCode. All Rights Reserved.
      </footer>
    </div>
  );
}

export default Page;
