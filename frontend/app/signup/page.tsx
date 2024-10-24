'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();

  // States for form data and error handling
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setError(null); // Clear previous errors

    // Frontend password confirmation check
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send the request to your backend for signup
      const response = await fetch('http://localhost:3000/auth/signup', { // Use your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to the home page or login page upon successful signup
        router.push('/login');
      } else {
        // Display backend error
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-background text-foreground">
      <header className="flex text-3xl font-bold">
        CREATE AN ACCOUNT
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <Input 
          className="rounded-xl h-10 w-80" 
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <Input 
          className="rounded-xl h-10 w-80" 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <Input 
          className="rounded-xl h-10 w-80" 
          type="password" 
          placeholder="Confirm Password" 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
        <Button
          className="bg-primary text-primary-foreground rounded-full w-32 h-10 flex items-center justify-center"
          onClick={handleSignup}
        >
          Sign up
        </Button>

        {/* Display error message if any */}
        {error && <div className="text-red-500">{error}</div>}

        <div className="text-sm text-muted-foreground mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </div>
      </main>
      <footer className="w-full py-4 text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} TesseractCode. All Rights Reserved.
            </footer>
    </div>
  );
}

export default Page;
