'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function page() {
  const router = useRouter();

  const handleSignup= () => {
    router.push('/'); // Navigate to home page
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-background text-foreground">
      <header className="flex text-3xl font-bold">
        CREATE AN ACCOUNT
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <Input className="rounded-xl h-10 w-80" placeholder="Username" />
        <Input className="rounded-xl h-10 w-80" type="password" placeholder="Password" />
        <Input className="rounded-xl h-10 w-80" type="password" placeholder="Confirm Password" />
        <Button className="bg-primary text-primary-foreground rounded-full w-32 h-10 flex items-center justify-center"
        onClick={handleSignup}>
          sign up
        </Button>
        <div className="text-sm text-muted-foreground mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-muted-foreground">
        ceva ceva
      </footer>
    </div>
  );
}

export default page;