"use client";
import classes from "./header.module.css";
import Link from "next/link";
import {usePathname} from "next/navigation";

//todo Add fous routes as a global configuration react context or zustand store

// Focus meaning the navigation is not shown
const focusRoutes = ["/focus", "/", "/coffee"];


export default function Header() {
    const currentRoute = usePathname();
    const isFocusRoute = focusRoutes.includes(currentRoute);

    return (
        <span>
            {!isFocusRoute && <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "20px",
                    marginRight: "20px",
                    marginTop: "5px",
                    marginBottom: "10px",
                    gap: "20px",
                    // Doesn't work
                    fontSize: "12px",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "5px",
                }}
            >
              <span style={{borderRight: "1px solid #ccc", paddingRight: "20px"}}>
                <Link href="/">...</Link>
              </span>
                <span style={{borderRight: "1px solid #ccc", paddingRight: "20px"}}>
                <Link href="/home">Home</Link>
              </span>

                <span style={{borderRight: "1px solid #ccc", paddingRight: "20px"}}>
                <Link href="/constraints">Constraints</Link>
              </span>
                <span style={{borderRight: "1px solid #ccc", paddingRight: "20px"}}>
                <Link href="/sprint">Sprint</Link>
              </span>
                <span style={{borderRight: "1px solid #ccc", paddingRight: "20px"}}>
                <Link href="/plan">Plan</Link>
              </span>
                <span style={{borderRight: "1px solid #ccc", paddingRight: "20px"}}>
                <Link href="/gantt">Gantt</Link>
              </span>
                {/*Quarterly*/}
                <span style={{borderRight: "1px solid #ccc", paddingRight: "20px"}}>
                <Link href="/quarterly">Quarterly</Link>
              </span>
                <span>
                <Link href="/epic">Epics</Link>
              </span>


                {/* This will align ZenGrid to the far right */}
                <span className={classes.jotiOne} style={{marginLeft: "auto"}}>
                ZenGrid
              </span>{" "}
            </div>}
        </span>
    );
}
