"use client";
import {GiCoffeeCup} from "react-icons/gi";
import { IoCloseCircleOutline } from "react-icons/io5";

import React from 'react';
import { motion } from "framer-motion";
import {useRouter} from "next/navigation";

/**
 * Monitization support component
 * @constructor
 */

/*
TODO
- Add a 'thank you' message
- Add fade out animation
- Add a configurable time for reappearing -> Put the visibility into a global state
 */
export const CoffeeForDevs = () => {
    const [show, setShow] = React.useState(true);
    const router = useRouter();
    return (
        <div>
            {show && <motion.div
            initial={{ right: '20px' }}
            animate={{ right: '80px' }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ bottom: '100px', position: 'absolute' }}
        >
            <motion.div
                animate={{ rotate: [0, -20, 20, 0] }}
                transition={{ delay: 1, duration: 1, ease: "easeInOut" }} // Adjust the delay and duration as needed
            >
                <div style={{ cursor: 'hand' }}>
                    <IoCloseCircleOutline size={`30px`}
                        style={{top:'4px',right:'4px',position:'absolute',color: 'lightgrey' }}
                        onClick={() => setShow(!show)
                    }
                    />
                    <GiCoffeeCup size={'140px'}
                        onClick={
                            //() => setShow(!show)
                            () => router.push("/coffee")
                        }
                    />
                </div>
            </motion.div>
        </motion.div>}
        </div>
    );
}
