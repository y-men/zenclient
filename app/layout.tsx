
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "@/components/footer";
import {usePathname, useRouter} from "next/navigation";
import {CoffeeForDevs} from "@/components/coffe-for-devs";

const inter = Inter({subsets: ["latin"]});


export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {


    return (
        <html lang="en">
            <body className={`${inter.className} d-flex flex-column min-vh-100`}>
                <Header/>
                    <div className="container flex-grow-1 my-3">
                        {children}
                    </div>
                <CoffeeForDevs/>
                <Footer/>
            </body>
        </html>
    );

}

export const metadata: Metadata = {
    title: "ZenGrid",
};

