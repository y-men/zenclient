import Focus from "@/components/focus";
import {color} from "framer-motion";
import Link from "next/link";

export default function Coffee() {
  return (
    <div>
        <Focus>
            <div className="d-flex flex-column mt-4" style={{ alignItems: 'flex-start' }} >
                <h1 style={{fontFamily: "'Luckiest Guy', cursive" }}>

                    Coffee for the devs!
                </h1>
                <span style={{color: 'grey'}}>
                    Help us code faster... more coffee, more features.
                    <Link href="/coffee/buy" style={{
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        lineHeight: 'inherit',
                        color: 'inherit'
                    }}>
                        {` `}Buy us a coffee
                    </Link>
                    {` `}or visit our sponsors and become a part of our journey!
                </span>
            </div>
        </Focus>
    </div>
  );
}