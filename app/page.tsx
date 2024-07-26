import './globals.css'; // Adjust the path as necessary
import Image from "next/image";
import DataGrid from "react-data-grid";
// import 'react-data-grid/dist/react-data-grid.css'; // CSS for react-data-grid
import "react-data-grid/lib/styles.css";
import HomeCarousel from "@/components/home-carousel";


export default function Home() {
  return (
    <div>
      <HomeCarousel/>
    </div>

  );
}
