'use client';
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Importing the accordion components from shadcn
import Link from 'next/link';

function Page() {
  const [companyName, setCompanyName] = useState('');
  const [judet, setJudet] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]); // To store search results (now expects an array of objects)
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null); // Reference to the result section

  const handleSearch = async () => {
    setError(''); // Reset any previous error
    setSearchResults([]); // Reset previous results
  
    // Input validation
    if (companyName.length < 3) {
      setError("Company name must be at least 3 characters long.");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/companies/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: companyName,
          judet: judet || undefined, // Only send `judet` if it's provided
        }),
        credentials: 'include', // Include cookies (JWT token) in the request
      });
  
      const data = await response.json();
  
      if (response.ok && data.companies) {
        setSearchResults(data.companies); // Update the state with the fetched results
      } else {
        setError(data.error || 'No companies found.');
      }
    } catch (error) {
      setError('An error occurred while searching for companies.');
    }
  
    // Scroll to the result section and align it to the top of the screen
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  

  return (
    <div className="flex-grow grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-background text-foreground">
      <header className="flex text-3xl font-bold">
        Cautare companie
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <Input
          className="rounded-xl h-10 w-80"
          placeholder="Numele companiei"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Input
          className="rounded-xl h-10 w-80"
          placeholder="Judet (optional)"
          value={judet}
          onChange={(e) => setJudet(e.target.value)}
        />
        <Button
          className="bg-primary text-primary-foreground rounded-full w-32 h-10 flex items-center justify-center"
          onClick={handleSearch}
        >
          Cautare
        </Button>
        <div ref={resultRef} className="w-full">
          {error && <p className="text-red-500">{error}</p>}
          {searchResults.length > 0 && (
            <Accordion type="single" collapsible className="mt-20 w-full pb-96">
              {searchResults.map((company, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="mb-4">
                  <AccordionTrigger className="text-2xl p-4 font-bold rounded-lg">
                    {company.denumire} ({company.judet})
                  </AccordionTrigger>
                  <AccordionContent className="p-6 text-lg">
                    <p><strong>Judet:</strong> {company.judet}</p>
                    <p><strong>CIF:</strong> {company.cif}</p>
                    <Link
                      href={`/grafic?company=${encodeURIComponent(company.denumire)}`}
                      className="mt-4 inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      View Graph
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </main>
    </div>
  );
}

export default Page;
