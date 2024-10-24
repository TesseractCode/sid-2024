import { MultiLineChart } from "@/components/ui/multi-line-chart";
import { SingleLineChart } from "@/components/ui/single-line-chart";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  


const mockCif = '123456789'
const mockName = 'Delutza'

interface CompanyIndicators {
    cif: number;
    year: number;
    i1: number; // ACTIVE IMOBILIZATE - TOTAL
    i2: number; // ACTIVE CIRCULANTE - TOTAL
    i3: number; // Stocuri
    i4: number; // Creante
    i5: number; // Casa si conturi la banci
    i6: number; // CHELTUIELI IN AVANS
    i7: number; // DATORII
    i8: number; // VENITURI IN AVANS
    i9: number; // PROVIZIOANE
    i10: number; // CAPITALURI - TOTAL
    i11: number; // Capital subscris varsat
    i12: number; // Patrimoniul regiei
    i13: number; // Cifra de afaceri neta
    i14: number; // VENITURI TOTALE
    i15: number; // CHELTUIELI TOTALE
    i16: number; // Profit brut
    i17: number; // Pierdere bruta
    i18: number; // Profit net
    i19: number; // Pierdere neta
    i20: number; // Numar mediu de salariati
  }
  
  const mockCompanyIndicators: CompanyIndicators[] = [
    {
      cif: 123456789,
      year: 2017,
      i1: 100000,
      i2: 50000,
      i3: 20000,
      i4: 15000,
      i5: 5000,
      i6: 3000,
      i7: 40000,
      i8: 2000,
      i9: 5000,
      i10: 70000,
      i11: 60000,
      i12: 0,
      i13: 120000,
      i14: 150000,
      i15: 140000,
      i16: 10000,
      i17: 0,
      i18: 8000,
      i19: 0,
      i20: 50,
    },
    {
      cif: 123456789,
      year: 2018,
      i1: 200000,
      i2: 80000,
      i3: 30000,
      i4: 25000,
      i5: 10000,
      i6: 4000,
      i7: 60000,
      i8: 5000,
      i9: 8000,
      i10: 120000,
      i11: 110000,
      i12: 0,
      i13: 200000,
      i14: 250000,
      i15: 240000,
      i16: 15000,
      i17: 0,
      i18: 12000,
      i19: 0,
      i20: 100,
    },
    {
      cif: 123456789,
      year: 2019,
      i1: 150000,
      i2: 60000,
      i3: 25000,
      i4: 18000,
      i5: 8000,
      i6: 3500,
      i7: 50000,
      i8: 3000,
      i9: 7000,
      i10: 90000,
      i11: 80000,
      i12: 0,
      i13: 180000,
      i14: 220000,
      i15: 210000,
      i16: 10000,
      i17: 0,
      i18: 9000,
      i19: 0,
      i20: 75,
    },
    {
      cif: 123456789,
      year: 2020,
      i1: 120000,
      i2: 45000,
      i3: 18000,
      i4: 12000,
      i5: 6000,
      i6: 2500,
      i7: 42000,
      i8: 1500,
      i9: 4500,
      i10: 75000,
      i11: 70000,
      i12: 0,
      i13: 150000,
      i14: 170000,
      i15: 160000,
      i16: 12000,
      i17: 0,
      i18: 10000,
      i19: 0,
      i20: 60,
    },
    {
      cif: 123456789,
      year: 2021,
      i1: 250000,
      i2: 90000,
      i3: 35000,
      i4: 30000,
      i5: 12000,
      i6: 5000,
      i7: 70000,
      i8: 6000,
      i9: 10000,
      i10: 130000,
      i11: 120000,
      i12: 0,
      i13: 250000,
      i14: 280000,
      i15: 260000,
      i16: 20000,
      i17: 0,
      i18: 18000,
      i19: 0,
      i20: 120,
    },
    {
      cif: 123456789,
      year: 2022,
      i1: 130000,
      i2: 55000,
      i3: 22000,
      i4: 16000,
      i5: 7000,
      i6: 3200,
      i7: 46000,
      i8: 2200,
      i9: 6000,
      i10: 85000,
      i11: 75000,
      i12: 0,
      i13: 140000,
      i14: 160000,
      i15: 150000,
      i16: 12000,
      i17: 0,
      i18: 10000,
      i19: 0,
      i20: 65,
    },
    {
      cif: 123456789,
      year: 2023,
      i1: 280000,
      i2: 95000,
      i3: 37000,
      i4: 32000,
      i5: 15000,
      i6: 5500,
      i7: 76000,
      i8: 7500,
      i9: 11000,
      i10: 140000,
      i11: 130000,
      i12: 0,
      i13: 280000,
      i14: 310000,
      i15: 290000,
      i16: 25000,
      i17: 0,
      i18: 20000,
      i19: 0,
      i20: 130,
    }
  ];
  const data1 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i1, // Profit net
  }));
  
  const data2 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i2, // Pierdere neta
  }));
  const data3 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i3, // Profit net
  }));

  const data4 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i4, // Profit net
  }));
  
  const data5 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i5, // Pierdere neta
  }));
  const data6 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i6, // Profit net
  }));
  
  const data7 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i7, // Pierdere neta
  }));
  
  const data8 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i8, // Profit net
  }));
  
  const data9 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i9, // Pierdere neta
  }));
  const data10 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i10, // Profit net
  }));
  
  const data11 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i11, // Pierdere neta
  }));
  const data12 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i12, // Profit net
  }));
  
  const data13 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i13, // Pierdere neta
  }));
  const data14 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i14, // Profit net
  }));
  
  const data15 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i15, // Pierdere neta
  }));
  const data16 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i16, // Profit net
  }));
  
  const data17 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i17, // Pierdere neta
  }));
  const data18 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i18, // Profit net
  }));
  
  const data19 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i19, // Pierdere neta
  }));
  
  const data20 = mockCompanyIndicators.map(item => ({
    year: item.year,
    value: item.i20, // Pierdere neta
  }));
  
  function Page() {
    return (
      <div className="space-y-8 mt-8 mb-8">

        
        <SingleLineChart
          title="Cifra de afaceri neta"
          description={`${mockName} cu CIF ${mockCif}`}
          data1={data13}
          label1="Cifra de afaceri neta "
        />
        <MultiLineChart
          title="Profit net si Pierdere neta"
          description={`${mockName} cu CIF ${mockCif}`}
          data1={data18}
          data2={data19}
          label1="Profit net "
          label2="Pierdere neta "
        />
        <MultiLineChart
          title="Profit brut si Pierdere bruta"
          description={`${mockName} cu CIF ${mockCif}`}
          data1={data16}
          data2={data17}
          label1="Profit brut "
          label2="Pierdere bruta "
        />
        <MultiLineChart
          title="Venituri totale si Cheltuieli totale"
          description={`${mockName} cu CIF ${mockCif}`}
          data1={data14}
          data2={data15}
          label1="Venituri totale "
          label2="Cheltuieli totale "
        />
        <MultiLineChart
          title="Venituri in avans si Cheltuieli in avans"
          description={`${mockName} cu CIF ${mockCif}`}
          data1={data6}
          data2={data8}
          label1="Venituri in avans "
          label2="Cheltuieli in avans "
        />

        <SingleLineChart
          title="Datorii"
          description={`${mockName} cu CIF ${mockCif}`}
          data1={data13}
          label1="Datorii "
        />

        <SingleLineChart
          title="Numar mediu de salariati"
          description={`${mockName} cu CIF ${mockCif}`}
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
          {mockCompanyIndicators.map((item) => (
            <TableRow key={item.year}>
              <TableCell className="font-medium">{item.year}</TableCell>
              <TableCell>{item.i10}</TableCell>
              <TableCell>{item.i1}</TableCell>
              <TableCell>{item.i2}</TableCell>
              <TableCell>{item.i3}</TableCell>
              <TableCell>{item.i5}</TableCell>
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