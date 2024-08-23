import {retriveAllSprintDataById} from "@/actions";
import MatrixFormGrid from "@/components/matrix-form-grid";
import {dlog} from "@/utils";
import {SQLLiteSprintOwnerCommitmentRepository} from "@/db";


export default async function EditSprint(props: { params: { id: string } }) {

    const {name} = await retriveAllSprintDataById(props.params.id) || {name: "N/A"};
    const owners = ['Thor', 'Fandral', 'Hogun', 'Volstagg', 'Sif'];
    const deductions = ['Total', 'Vacations', 'KTLO', 'Misc'];

    const updateSprintData = async (formData: FormData) => {
        "use server";
        dlog()
        const data = JSON.parse(formData.get('sprintData') as string);
        const repository = new SQLLiteSprintOwnerCommitmentRepository()

        //Parse the data from table into SprintOwnerCommitment
        const s = data.filter( (row: any) => row.subject === 'Summary')
        console.log(`s: ${JSON.stringify(s)}`);
        Object.keys(s[0])
            .filter((key) => key !== "subject")
            .forEach((key: any) => {
                console.log(`key: ${key} value: ${s[0][key]}`);
                repository.upsert({ownerId: key, sprintId:props.params.id, commited: Number(s[0][key])})

            })

    }

    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <h1>Edit Sprint</h1>
            <h3 className=" text-center mt-4">{name}</h3>
            <MatrixFormGrid subjects={deductions} matrixFormAction={updateSprintData}/>
        </div>
    )
}