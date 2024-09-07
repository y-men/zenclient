import HomeItemsContainer from "@/app/home/home-items-container";
import React from "react";
import {dlog} from "@/utils";
import Image from "next/image";
import StyledMonochromeImage from "@/app/home/styled-monochrome-image";
// import {getRandomImage} from "@/actions";


const getRandomImage = async () => {
    "use server"
    dlog()

    //Cashe busting random number
    const randomParam = `&r=${Math.random()}`; // Add random number to URL
    const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.PUBLIC_UNSPLASH_ACCESS_KEY}${randomParam}`,
        {
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
    if (!res.ok) {
        throw new Error("Failed to fetch image from Unsplash");
    }
    const imageUrl = await res.json().then((res) => { return res.urls.regular });
    console.log(imageUrl);
    return imageUrl;
}

export default async function  Home() {
    //Retrive image from Unsplash
    const imageUrl = await getRandomImage();
    return (
        <div>
            <div style={{top: 80, right:80, position:"absolute"}}>
                <StyledMonochromeImage
                    src={imageUrl}
                    alt="Styled atmospheric art"
                    width={280}
                    height={500}
                />
            </div>
            <HomeItemsContainer/>
        </div>
    );
}

// @ts-ignore


