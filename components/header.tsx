
import classes from "./header.module.css";
import Link from "next/link";
export default function Header() {
  return (
    // todo - move this to a separate component
    <div
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
      <span style={{ borderRight: "1px solid #ccc", paddingRight: "20px" }}>
        <Link href="/">Home</Link>
      </span>
      <span style={{ borderRight: "1px solid #ccc", paddingRight: "20px" }}>
        <Link href="/constraints">Constraints</Link>
      </span>
      <span style={{ borderRight: "1px solid #ccc", paddingRight: "20px" }}>
        <Link href="/grid">Grid</Link>
      </span>
      <span>
        <Link href="/plan">Plan</Link>
      </span>
      {/* This will align ZenGrid to the far right */}
      <span className={classes.jotiOne} style={{ marginLeft: "auto" }}>
        ZenGrid
      </span>{" "}
    </div>
  );
}
