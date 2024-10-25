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

function Page() {
  const searchParams = useSearchParams();
  const [companyIndicators, setCompanyIndicators] = useState<CompanyIndicator[]>([]);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [prev, setPrev] = useState<any>(null);
  const [cif, setCif] = useState<string | null>(null);
  
  const queryCif = searchParams.get("cif");
  const queryCompanyName = searchParams.get("company_name");

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

  // UseEffect to trigger the fetch
  useEffect(() => {
    fetchCompanyIndicators(queryCif);
    fetchCAEN(queryCif);
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
      <footer className="w-full pt-12 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} TesseractCode. All Rights Reserved.
      </footer>
    </div>
  );
}

export default Page;
