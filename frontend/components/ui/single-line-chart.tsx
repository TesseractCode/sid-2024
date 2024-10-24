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

// Chart configuration


// Generic MultiLineChart component
export function SingleLineChart({
  title,
  description,
  data1,
  label1,
}: {
  title: string;
  description: string;
  data1: { year: number; value: number }[]; // Data for first line
  label1: string;
}) {
  // Merge data1 and data2 into a single data array for the chart
  const combinedData = data1.map((item, index) => ({
    year: item.year,
    data1: item.value,
  }));

  const chartConfig = {
    data1: {
      label: label1,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle> {/* Dynamic title */}
        <CardDescription>{description}</CardDescription> {/* Dynamic description */}
      </CardHeader>
      <CardContent className="w-full h-[400px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <LineChart
            accessibilityLayer
            data={combinedData}
            margin={{
              left: 12,
              right: 12,
            }}
            width={1000}
            height={500}
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
              dataKey="data1"
              type="monotone"
              stroke="var(--color-data1)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
