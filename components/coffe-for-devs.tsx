"use client";
import {GiCoffeeCup} from "react-icons/gi";
import React from 'react';
import { motion } from "framer-motion";

/**
 * Monitization support component
 * @constructor
 */

/*
TODO
- Add a 'x' button to close the coffee cup
- Add a 'buy me a coffee' link
- Add a 'thank you' message
- Add fade out animation
- Add a configurable time for reappearing
 */
export const CoffeeForDevs = () => {
    const [show, setShow] = React.useState(true);
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
                <GiCoffeeCup size={'140px'}
                    onClick={() => setShow(!show)}
                />
            </motion.div>
        </motion.div>}
        </div>
    );
}
