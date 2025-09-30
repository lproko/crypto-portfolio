import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { AuthProvider } from "@/context/AuthContext";
import { PortfolioPriceUpdater } from "@/components/portfolio/PortfolioPriceUpdater";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Portfolio Tracker",
  description: "Track your cryptocurrency portfolio with real-time data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <PortfolioProvider>
              <PortfolioPriceUpdater />
              {children}
            </PortfolioProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
