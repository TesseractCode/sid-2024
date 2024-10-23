'use client';  // Make this a client component

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from "react";

function Page() {
  const router = useRouter();

  // States for email, password, and error handling
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null); // Clear previous error

    try {
      // Send the request to your proxy backend
      const response = await fetch('http://localhost:3000/auth/login', { // Use backend URL (port 3000)
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include', // Ensure cookies can be sent and received
      });
      

      const data = await response.json();

      if (response.ok) {
        // Navigate to the home page on successful login
        router.push('/');
      } else {
        // Show error if login fails
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    }
  };


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-background text-foreground">
      <header className="flex text-3xl font-bold">
        LOGIN
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <Input className="rounded-xl h-10 w-80" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
        <Input className="rounded-xl h-10 w-80" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <Button
          className="bg-primary text-primary-foreground rounded-full w-32 h-10 flex items-center justify-center"
          onClick={handleLogin}
        >
          login
        </Button>
        <div className="text-sm text-muted-foreground mt-4">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-muted-foreground">
        ceva ceva
      </footer>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}

export default Page;
