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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination'; // Import the custom pagination components
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer'; // Import Drawer components
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { PopoverContent } from '@radix-ui/react-popover';
import { Card } from '@/components/ui/card';

const ITEMS_PER_PAGE = 5; // Number of items per page

function Page() {
  const [companyName, setCompanyName] = useState('');
  const [judet, setJudet] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]); // To store search results (now expects an array of objects)
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState('caut-simpla')
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [popFlag, setPopFlag] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null); // Reference to the result section
  const detaliiButtonRef = useRef<HTMLButtonElement>(null); // Add a reference for the button


  const handlePopOver = () => {
    setPopFlag(true);
  }


  const handleSearch = () => {
    if (selectedOption === 'caut-simpla') {
      handleCautSimpla();
    } else if (selectedOption === 'caut-judet') {
      handleCautJudet();
    } else if (selectedOption === 'caut-cif') {
      handleCautCif();
    } else if (selectedOption === 'caut-cui') {
      handleCautCui();
    } else if (selectedOption === 'caut-caen') {
      handleCautCaen();
    }
  };

  const handleCautSimpla = async () => {
    setError(''); // Clear any previous error
    setSearchResults([]); // Reset search results
    setCurrentPage(1); // Reset pagination
  
    // Check if the input is valid
    if (!companyName || companyName.length < 3) {
      setError("Company name must be at least 3 characters long.");
      return;
    }
  
    try {
      // Send a request to the /public/search endpoint
      const response = await fetch(`http://localhost:3000/public/search?name=${encodeURIComponent(companyName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok && data.companies) {
        setSearchResults(data.companies); // Set the returned companies in the search results
      } else {
        setError(data.error || 'No companies found.');
      }
    } catch (error) {
      setError('An error occurred while searching for companies.');
    }
  };
  

  const handleCautJudet = async () => {
    setError(''); // Reset any previous error
    setSearchResults([]); // Reset previous results
    setCurrentPage(1);

    // Hardcoded dummy data for testing purposes
    if (companyName === 'aaa' && judet === 'aaa') {
      const dummyData = [
        { denumire: 'Company One', judet: 'AAA', cif: '111111' },
        { denumire: 'Company Two with a Very Very Long Name', judet: 'AAA', cif: '222222' },
        { denumire: 'ShortCo', judet: 'AAA', cif: '333333' },
        { denumire: 'Extremely Long Company Name That Keeps Going and Going and Going aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', judet: 'AAA', cif: '444444' },
        { denumire: 'Medium Sized Company Name', judet: 'AAA', cif: '555555' },
        { denumire: 'Another ShortCo', judet: 'AAA', cif: '666666' },
        { denumire: 'Another Extremely Long Company Name That Just Goes On Forever and Ever Without Stopping', judet: 'AAA', cif: '777777' },
        { denumire: 'Even Longer Than the Longest Company Name You Can Imagine Right Now', judet: 'AAA', cif: '888888' },
        { denumire: 'Tiny', judet: 'AAA', cif: '999999' },
        { denumire: 'Super Long Company Name That Will Help Test UI Edge Cases', judet: 'AAA', cif: '101010' },
        { denumire: 'Short', judet: 'AAA', cif: '111111' },
      ];
      setSearchResults(dummyData);

      // Scroll to the result section and align it to the top of the screen
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    // Real API call when not using "aaa"
    try {
      const response = await fetch('http://localhost:3000/api/companies/search', {
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


  const handleCautCif = () => {
    console.log('Cautare dupa CIF');
  };

  const handleCautCui = () => {
    console.log('Cautare dupa CUI');
  };
  
  const handleCautCaen = () => {
    console.log('Cautare dupa cod CAEN');
  };

  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const currentItems = searchResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex-grow grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-background text-foreground">
      <header className="flex text-3xl font-bold">Cautare companie</header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
      <Input
        className="rounded-xl h-10 w-80"
        placeholder={
          selectedOption === 'caut-simpla' || selectedOption === 'caut-judet'
            ? 'Numele companiei'
            : selectedOption === 'caut-cif'
            ? 'CIF'
            : selectedOption === 'caut-cui'
            ? 'CUI'
            : selectedOption === 'caut-caen'
            ? 'CAEN'
            : ''
        }
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
        {selectedOption == "caut-judet" &&
          <Input
            className="rounded-xl h-10 w-80"
            placeholder="Judet (optional)"
            value={judet}
            onChange={(e) => setJudet(e.target.value)}
          />
        }
        <Button
          className="bg-primary text-primary-foreground rounded-full w-32 h-10 flex items-center justify-center"
          onClick={handleSearch}
        >
          Cautare
        </Button>
        <div className='flex'>
          <Drawer>
            <DrawerTrigger asChild>
              <a href="#" className="mt-2 text-blue-500 hover:underline">
                Advanced settings
              </a>
            </DrawerTrigger>
            <DrawerContent className="max-w-[50%] mx-auto h-[80vh]"> {/* 50% width, centered, 80% height */}
              <DrawerHeader>
                <DrawerTitle>Advanced Settings</DrawerTitle>
              </DrawerHeader>
              <div className="p-12 ml-auto mr-auto flex justify-center">
                <RadioGroup 
                  value={selectedOption} // Set the value to persist selected option
                  onValueChange={(val) => setSelectedOption(val)} // Update state on change
                  className="space-y-4 w-full max-w-[400px]"
                >
                  <div className="flex items-center justify-start space-x-4 text-lg">
                    <RadioGroupItem value="caut-simpla" id="caut-simpla" className="h-6 w-6" />
                    <Label htmlFor="caut-simpla" className="text-lg">Cautare simpla</Label>
                  </div>
                  <div className="flex items-center justify-start space-x-4 text-lg">
                    <RadioGroupItem value="caut-judet" id="caut-judet" className="h-6 w-6" />
                    <Label htmlFor="caut-judet" className="text-lg">Cautare dupa judet</Label>
                  </div>
                  <div className="flex items-center justify-start space-x-4 text-lg">
                    <RadioGroupItem value="caut-cif" id="caut-cif" className="h-6 w-6" />
                    <Label htmlFor="caut-cif" className="text-lg">Cautare dupa CIF</Label>
                  </div>
                  <div className="flex items-center justify-start space-x-4 text-lg">
                    <RadioGroupItem value="caut-cui" id="caut-cui" className="h-6 w-6" />
                    <Label htmlFor="caut-cui" className="text-lg">Cautare dupa CUI</Label>
                  </div>
                  <div className="flex items-center justify-start space-x-4 text-lg">
                    <RadioGroupItem value="caut-caen" id="caut-caen" className="h-6 w-6" />
                    <Label htmlFor="caut-caen" className="text-lg">Cautare dupa cod CAEN</Label>
                  </div>
                </RadioGroup>
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button className="w-full">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>


        <div ref={resultRef} className="w-full">
          {error && <p className="text-red-500">{error}</p>}
          {searchResults.length > 0 && (
            <>
            
              <Accordion type="single" collapsible className="mt-20 w-full pb-12">
                {currentItems.map((company, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="flex-grow mb-4 text-left justify-start items-start">
                    <AccordionTrigger className="text-2xl p-4 font-bold rounded-lg text-left">
                      {company.denumire} ({company.judet})
                    </AccordionTrigger>
                    <AccordionContent className="p-6 text-lg">
                      <p><strong>Judet:</strong> {company.judet}</p>
                      <p><strong>CIF:</strong> {company.cif}</p>
                      <div className='flex justify-center items-center'>
                      <Popover>
                        <PopoverTrigger> 
                        <Button
                            className="bg-primary text-primary-foreground rounded-full w-32 h-10 flex items-center justify-center"
                            onClick={() => {
                              setTimeout(() => {
                                detaliiButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                              }, 20); // Timeout to wait for the popover to open and render
                            }}
                            ref={detaliiButtonRef}>
                            Detalii
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Card className="w-[80vh] mx-auto h-[80vh] mb-8"></Card>
                        </PopoverContent>
                      </Popover>
                      </div>
                      {/* <Button
                        className="bg-primary text-primary-foreground rounded-full w-32 h-10 flex items-center justify-center"
                        onClick={handlePopOver}
                      >
                        Details
                      </Button> */}
                      {/* <Link
                        href={`/grafic?company=${encodeURIComponent(company.denumire)}`}
                        className="mt-4 inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                      >
                        View Graph
                      </Link> */}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <Pagination>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? 'hidden' : ''}
                />
                <PaginationContent>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </PaginationContent>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? 'hidden' : ''}
                />
              </Pagination>
            </>
          )}
        </div>

      </main>
      <footer className="w-full py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} TesseractCode. All Rights Reserved.
      </footer>
    </div>
  );
}

export default Page;
