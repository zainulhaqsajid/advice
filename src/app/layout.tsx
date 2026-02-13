import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Australian PR Pathway - Immigration Information Tool",
  description: "Comprehensive Australian permanent residency pathway information tool covering all visa categories, life scenarios, and immigration support tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-2">AU PR Pathway</h3>
                <p className="text-sm">Comprehensive immigration information tool for Australian permanent residency pathways.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Disclaimer</h3>
                <p className="text-sm">This tool provides general information only and does not constitute migration advice. Always consult a MARA-registered migration agent for personalised advice.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Data Sources</h3>
                <p className="text-sm">Information sourced from the Department of Home Affairs (DHA). Processing times and fees are estimates and may change.</p>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm">
              <p>This is an information tool only. Not a substitute for professional migration advice.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
