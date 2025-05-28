// eslint-disable-next-line react/display-name
"use client";
import {useGlobalStore} from "@/store/global-store";

export default () => {
    //Upload constraints data from global store
    const constraints = useGlobalStore(state => state.constraints);
    console.log(`constraints-data-grid.tsx constraints: ${constraints}`);



    return <></> ;

}