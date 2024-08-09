
import classes from "./header.module.css";
import Link from "next/link";
export default function Footer() {
  return (
    <footer
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
        borderTop: "1px solid #ccc",
        paddingBottom: "5px",
      }}
    >
      <span className={classes.jotiOneFooter} style={{ marginLeft: "auto" }}>
        ver 0.0.1
      </span>{" "}
    </footer>
  );
}
