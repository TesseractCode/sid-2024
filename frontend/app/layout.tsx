import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider, SidebarBody } from "@/components/ui/aceternity/sidebar";
import { AppSidebar } from "@/components/my-sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TesseractCode",
  description: "Noi stim viitorul. Tu in sti?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <SidebarProvider>
          {/* Make sure to use 'flex-row' to keep the sidebar on the side */}
          <div className="flex flex-row min-h-screen w-full">
            <AppSidebar />
            {/* Main wrapper div with min-h-screen */}
            <div className="flex flex-col flex-grow justify-between items-center w-full">
              {/* Main content with flex-grow to fill space */}
              <main className="flex flex-grow flex-col justify-center items-center w-full">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
