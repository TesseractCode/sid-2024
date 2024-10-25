'use client';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handlePushLogIn = async () => {
    router.push('login')
  }
  const handlePushLogOut = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST', // or 'GET' depending on how your backend handles it
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensures cookies are included in the request
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Logout successful', data.message);
        // Perform any additional logic after logout, like redirecting
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex text-3xl font-bold">
        WELCOME!
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

        <Button className="bg-primary text-primary-foreground rounded-full w-32 h-10 flex items-center justify-center"
          onClick={handlePushLogIn}>
          Log In
        </Button>
        <Button className="bg-primary text-primary-foreground rounded-full w-32 h-10 flex items-center justify-center"
          onClick={handlePushLogOut}>
          Log Out
        </Button>
      </main>
      <footer className="w-full py-4 text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} TesseractCode. All Rights Reserved.
      </footer>
    </div>
  );
}
