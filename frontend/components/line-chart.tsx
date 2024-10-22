"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

export const description = "A line chart";

// Example chart configuration
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// LineChartComponent expects a 'company' prop
export function Component({ company }: { company: string | null }) {
  const [chartData, setChartData] = useState([]); // State for chart data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) return; // Don't proceed if company is null
  
    // Fetch data from the backend using the company name
    async function fetchData() {
      try {
        const response = await fetch(`/api/proxy/get-company-data?company=${encodeURIComponent(company || '')}`);
        const data = await response.json();
  
        // Assuming the response data is an array of { month, desktop } objects
        setChartData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }
  
    fetchData();
  }, [company]);
  

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div className="flex justify-center items-center h-[90vh] w-full">
      <Card className="w-[90%] h-[60vh]">
        <CardHeader>
          <CardTitle>{company}</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="h-full w-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              width={700}
              height={400}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} stroke="rgb(200, 200, 200)" strokeOpacity={'10%'} />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="desktop"
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        {/* <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter> */}
      </Card>
    </div>
  );
}
