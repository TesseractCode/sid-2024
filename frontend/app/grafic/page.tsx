"use client";

import { useSearchParams } from "next/navigation";
import { Component as LineChartComponent } from "@/components/line-chart"; // Import the LineChart component from the file where it's defined

function Page() {
  const searchParams = useSearchParams();
  const companyName = searchParams.get("company"); // Get 'company' from URL

  return (
    <div className="flex-row p-8">
      {/* Pass the company name to the LineChartComponent */}
      <LineChartComponent company={companyName} />
                  <footer className="w-full pt-4 text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} TesseractCode. All Rights Reserved.
            </footer>
    </div>
  );
}

export default Page;
