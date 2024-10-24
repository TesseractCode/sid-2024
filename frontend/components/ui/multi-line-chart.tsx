"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data for company indicators
const mockCompanyIndicators = [
  {
    cif: 123456789,
    year: 2020,
    i18: 8000, // Profit net
    i19: 0,    // Pierdere neta
  },
  {
    cif: 123456789,
    year: 2021,
    i18: 12000, // Profit net
    i19: 0,     // Pierdere neta
  },
  {
    cif: 123456789,
    year: 2019,
    i18: 9000,  // Profit net
    i19: 0,     // Pierdere neta
  },
  {
    cif: 123456789,
    year: 2020,
    i18: 10000, // Profit net
    i19: 0,     // Pierdere neta
  },
  {
    cif: 123456789,
    year: 2021,
    i18: 18000, // Profit net
    i19: 0,     // Pierdere neta
  },
  {
    cif: 123456789,
    year: 2018,
    i18: 10000, // Profit net
    i19: 0,     // Pierdere neta
  },
  {
    cif: 123456789,
    year: 2022,
    i18: 20000, // Profit net
    i19: 0,     // Pierdere neta
  },
];

// Chart configuration
const chartConfig = {
  i18: {
    label: "Profit Net",
    color: "hsl(var(--chart-1))",
  },
  i19: {
    label: "Pierdere Neta",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function MultiLineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Profit & Loss</CardTitle>
        <CardDescription>Yearly Profit and Loss Data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={mockCompanyIndicators}
            margin={{
              left: 12,
              right: 12,
            }}
            width={700}
            height={400}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="i18"
              type="monotone"
              stroke="var(--color-i18)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="i19"
              type="monotone"
              stroke="var(--color-i19)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
