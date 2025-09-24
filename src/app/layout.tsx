import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/hooks/useAuth";
import { BookingProvider } from "@/providers/booking-provider";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EnvironmentCheck } from "@/components/config/EnvironmentCheck";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Shalean - Professional Cleaning Services",
  description: "Book professional cleaning services with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <EnvironmentCheck>
          <QueryProvider>
            <AuthProvider>
              <BookingProvider>
                <TooltipProvider>
                  <Header />
                  {children}
                  <Toaster />
                </TooltipProvider>
              </BookingProvider>
            </AuthProvider>
          </QueryProvider>
        </EnvironmentCheck>
      </body>
    </html>
  );
}
