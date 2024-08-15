import {retriveAllSprintDataById} from "@/actions";


export default async function Sprint(props: { params: { id: string } }) {

    const { name } = await retriveAllSprintDataById(props.params.id) || { name: "N/A" };

    return (
        <div>
            <h1>Sprint Page</h1>
            <p className="mt-4">{name}</p>
        </div>


    );
}