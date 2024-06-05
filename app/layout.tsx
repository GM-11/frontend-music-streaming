import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MySorobanReactProvider from "./web3/MySorobanReactProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stellar Music Streaming",
  description: "Made on Stellar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <MySorobanReactProvider>
        <body className={inter.className}>{children}</body>
      </MySorobanReactProvider>
    </html>
  );
}
