import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import Script from "next/script";

import NextTopLoader from "nextjs-toploader";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const CSROnly = dynamic(() => import("./csr-only"));

export const metadata: Metadata = {
  title: "Journal",
  description: "Discover, Engage, Evolve: Unveiling the Essence of Reading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/plugins/blur-up/ls.blur-up.min.js" />
      </head>
      <body className={`${inter.className} h-full flex flex-col`}>
        <NextTopLoader showSpinner={false} color="#34363c" shadow={false} />
        {children}
        <footer>
          <p className="p-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()}
            <a href="https://maxam.dev" className="ml-1 text-blue-500">
              maxam.dev
            </a>
          </p>
        </footer>
        <CSROnly />
      </body>
    </html>
  );
}
