"use client";

//import Image from "next/image";
import Image from "next/legacy/image";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from "./styled-monochrome-image.module.css";

//@ts-ignore
const StyledMonochromeImage = ({src, alt, width, height}) => {
    return (
        <div className="position-relative" style={{width, height}}>
            <Image
                src={src}
                alt={alt}
                layout="fill"
                objectFit="cover"
                className={classes.monochromeFilter}
            />
        </div>
    );
};

export default StyledMonochromeImage;