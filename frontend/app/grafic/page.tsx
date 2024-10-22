"use client";

import { useSearchParams } from "next/navigation";
import { Component as LineChartComponent } from "@/components/line-chart"; // Import the LineChart component from the file where it's defined

function Page() {
  const searchParams = useSearchParams();
  const companyName = searchParams.get("company"); // Get 'company' from URL

  return (
    <div className="flex p-8">
      {/* Pass the company name to the LineChartComponent */}
      <LineChartComponent company={companyName} />
    </div>
  );
}

export default Page;
