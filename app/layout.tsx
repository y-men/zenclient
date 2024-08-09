import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

// import { createContext, useContext, useState } from "react";

// const TaskContext = createContext({ tasks: [], setTasks: (tasks: any) => {} });
// function TaskProvider( { children }: Readonly<{ children: React.ReactNode }>) {
//   const [tasks, setTasks] = useState([]);
//   return (
//     <TaskContext.Provider value={{ tasks, setTasks }}>
//       {children}
//     </TaskContext.Provider>
//   );
// }


const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({ children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div style={{  margin: "20px" }}>
          {children}
        </div>
      </body>
    </html>
  );

}

export const metadata: Metadata = {
  title: "ZenGrid",
};

