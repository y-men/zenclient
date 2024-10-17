
"use client";

import classes from "./header.module.css";
import Link from "next/link";
import {useGlobalStore} from "@/store/global-store";
export default function Footer() {
    const currentQuarter = useGlobalStore(state => state.currentQuarter);

    return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        marginLeft: "20px",
        marginRight: "20px",
        marginTop: "10px",
        marginBottom: "10px",
        // Doesn't work
        borderTop: "1px solid #ccc",
        paddingBottom: "5px",
          paddingTop: "4px",
      }}
    >
      <div style={{ marginRight: "auto", border: "1px solid", padding: "2px"  }}>
        {currentQuarter}
      </div>{" "}

        <span style={{ marginLeft: "auto" }}>
        ver 0.0.1
      </span>{" "}
    </footer>
  );
}
