import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "@/components/footer";
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div style={{  margin: "20px" }}>
          {children}
        </div>
      <Footer />
      </body>
    </html>
  );

}

export const metadata: Metadata = {
  title: "ZenGrid",
};

