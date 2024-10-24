'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define TypeScript interfaces for the API response
interface CnpAttributes {
  sex: string;
  foreign_resident: boolean;
  date_of_birth: string | null;
  county_of_birth_code: string | null;
  county_of_birth: string | null;
  county_index: string | null;
  control: string | null;
}

interface CnpResponse {
  cnp: string;
  valid: boolean;
  parsed: {
    Attributes: CnpAttributes;
  };
}

interface GeneralResponse {
  status: "VALID" | "INVALID";
}

function Page() {
  const [selectedType, setSelectedType] = useState<string>(""); // Select type is a string
  const [val, setVal] = useState<string>(""); // Input value
  const [result, setResult] = useState<string | null>(""); // Result can be "VALID", "INVALID", or null
  const [error, setError] = useState<string>(""); // Error message
  const [cnpData, setCnpData] = useState<CnpAttributes | null>(null); // CNP-specific data, initially null

  // Handle search click
  const handleSearch = async () => {
    setResult(""); // Clear previous result
    setError("");  // Clear previous errors
    setCnpData(null); // Clear CNP data

    if (!selectedType || !val) {
      setError("Please select a type and enter a value.");
      return;
    }

    try {
      const response = await fetch("/api/proxy/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectedType,
          value: val,
        }),
      });

      const data: GeneralResponse | CnpResponse = await response.json();

      if (selectedType === "CNP") {
        // Handling CNP-specific response
        const cnpResponse = data as CnpResponse;
        if (cnpResponse.valid) {
          setResult("VALID");
          setCnpData(cnpResponse.parsed.Attributes); // Store parsed CNP attributes
        } else {
          setResult("INVALID");
        }
      } else {
        // Handle non-CNP validation (general validation)
        const generalResponse = data as GeneralResponse;
        if (generalResponse.status === "VALID" || generalResponse.status === "INVALID") {
          setResult(generalResponse.status);
        } else {
          setError("Unexpected response from the server.");
        }
      }
    } catch (error) {
        // setResult("INVALID")
      setError("Fetch failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Select input */}
      <Select onValueChange={(value) => setSelectedType(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CIF">CIF</SelectItem>
          <SelectItem value="CNP">CNP</SelectItem>
          <SelectItem value="IBAN">IBAN</SelectItem>
          <SelectItem value="BIC">BIC</SelectItem>
        </SelectContent>
      </Select>

      <Input
        className="mt-4 rounded-xl h-10 w-80"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder={`Enter ${selectedType || 'value'}`}
      />

      <Button
        className="mt-4 bg-primary text-primary-foreground rounded-full w-32 h-10 flex items-center justify-center"
        onClick={handleSearch}
      >
        Check
      </Button>

      {/* Display result or error */}
      {result && (
        <>
          <p className={`mt-4 text-lg ${result === "VALID" ? "text-green-600" : "text-red-600"}`}>
            {result}
          </p>
          {/* Conditional rendering for big checkmark or X */}
          {result === "VALID" && selectedType !== "CNP" ? (
            <p className="text-green-600 text-6xl mt-4">✓</p>
          ) : result === "INVALID" ? (
            <p className="text-red-600 text-6xl mt-4">✕</p>
          ) : null}
        </>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {/* CNP-specific details if valid */}
      {result === "VALID" && cnpData && selectedType === "CNP" && (
        <div className="mt-4 text-lg">
          <p><strong>Sex:</strong> {cnpData.sex}</p>
          <p><strong>Foreign Resident:</strong> {cnpData.foreign_resident ? "Yes" : "No"}</p>
          <p><strong>Date of Birth:</strong> {cnpData.date_of_birth || "N/A"}</p>
          <p><strong>County of Birth Code:</strong> {cnpData.county_of_birth_code || "N/A"}</p>
          <p><strong>County of Birth:</strong> {cnpData.county_of_birth || "N/A"}</p>
          <p><strong>County Index:</strong> {cnpData.county_index || "N/A"}</p>
          <p><strong>Control:</strong> {cnpData.control || "N/A"}</p>
        </div>
      )}
                  <footer className="w-full py-4 text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} TesseractCode. All Rights Reserved.
            </footer>
    </div>
  );
}

export default Page;
