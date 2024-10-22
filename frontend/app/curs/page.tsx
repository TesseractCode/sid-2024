'use client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePickerDemo } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function Page() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Selected date
  const [val, setVal] = useState<string>(""); // Input value for currency
  const [exc, setExc] = useState<string>(""); // Input value for exchange amount
  const [res, setRes] = useState<number | null>(null); // Result of exchange
  const [rate, setRate] = useState<number | null>(null); // Exchange rate result
  const [error, setError] = useState<string | null>(null); // Error handling

  const handleExchange = async () => {
    const exchangeValue = parseFloat(exc); // Convert exchange input to a float
    if (!isNaN(exchangeValue) && rate !== null) {
      const result = exchangeValue * rate; // Perform the exchange calculation
      setRes(result); // Set the result state to display the calculated value
    } else {
      setError("Please enter a valid amount."); // Handle invalid input
    }
  };

  // Handle search click
  const handleSearch = async () => {
    setRate(null); // Clear previous rate
    setRes(null);  // Clear previous result
    setError(null); // Clear previous error

    if (!val || !selectedDate) {
      setError("Please enter a currency and select a date.");
      return;
    }

    try {
      const response = await fetch("/api/proxy/get-rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currency: val.toUpperCase(), // Send the currency in uppercase
          date: selectedDate.toISOString().split("T")[0], // Send the date in YYYY-MM-DD format
        }),
      });

      const data = await response.json();

      if (data.rate) {
        setRate(data.rate); // Assuming backend returns the rate as `rate`
      } else {
        setError("Rate not found for the selected currency and date.");
      }
    } catch (error) {
        setError("Fetch failed")
    //   setRate(4.32); // Dummy rate for testing
    }
  };

  // When 'val' changes, reset rate, result, and error
  const handleValChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
    setRate(null);
    setRes(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">      
      <header className="flex text-3xl font-bold">Rata de schimb RON</header>
      
      <Input
        className="mt-4 rounded-xl h-10 w-80"
        value={val}
        onChange={handleValChange} // Use the new handler to reset state
        placeholder="Enter currency (ex: EUR)"
      />

      <DatePickerDemo onDateChange={setSelectedDate} />

      <Button
        className="mt-4 bg-primary text-primary-foreground rounded-full w-32 h-10 flex items-center justify-center"
        onClick={handleSearch}
      >
        Check
      </Button>

      {rate !== null && 
      <Card className="w-40 h-16 p-6 flex items-center justify-center text-lg">
        Rate: {rate}
      </Card>}

      {rate !== null && 
      <>
        <Input
          className="mt-4 rounded-xl h-10 w-80"
          value={exc}
          onChange={(e) => setExc(e.target.value)}
          placeholder="Enter amount in RON"
        /> 

        <Button
          className="mt-4 bg-primary text-primary-foreground rounded-full w-32 h-10 flex items-center justify-center"
          onClick={handleExchange}
        >        
          Exchange
        </Button>
      </>}

      {res !== null && 
        <Card className="w-40 h-16 p-6 flex items-center justify-center text-lg">
          {res.toFixed(2)} {val.toUpperCase()}
        </Card>
      }

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}

export default Page;
