"use client";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import {useRouter} from "next/navigation";

export default function Focus({children} : {children: any}) {
    const router = useRouter();
    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-start mb-2">
                <IoArrowBackCircleOutline size={60} onClick={() => router.back()}/>
            </div>
            <div className="d-flex">
                {children}
            </div>
        </div>
    );


}