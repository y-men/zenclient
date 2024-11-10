import {retriveAllSprintDataById} from "@/actions";
import MatrixFormGrid from "@/components/matrix-form-grid";
import {dlog} from "@/utils";
import {SQLLiteOwnerRepository, SQLLiteSprintOwnerCommitmentRepository} from "@/db";
import {HydrateGlobalStore} from "@/components/hydrate-store";
import {ISprintOwnerCommitment} from "@/model/types";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";

/**
 * Retrieve the sprint data into the matrix to be displayed
 * @param x Contains the deductions for the sprint
 * @param props Contains the sprint id
 */
const retrieveSprintData = async (x :any, props: { params: { id: string } }): Promise<number[][]> => {
    "use server";
    dlog()
    const sprintOwnerCommitmentRepository = new SQLLiteSprintOwnerCommitmentRepository()

    // Retrieve the data from the database
    const data = await sprintOwnerCommitmentRepository.findMany({where:{sprintId: props.params.id}})

    const ownerRepository = new SQLLiteOwnerRepository()
    const ownerIds = (await ownerRepository.getAll())?.map(({id}) => id) ?? []

    const matrix:number [][] = []
    x.forEach((deduction:any) => {
        const row: number[] = []
        ownerIds.forEach((ownerId) => {
            const constraint = data?.find(
                ({ownerId: oId, deductionId}) =>
                    oId === ownerId && deductionId === parseInt(deduction.id)
            )
            row.push(constraint?.commited ?? 0)
        })
        matrix.push(row)
    })

    console.log(`>>> matrix:`)
    console.dir(matrix)
    return matrix;
}

export default async function EditSprint(props: { params: { id: string } }) {

    const {name} = (await retriveAllSprintDataById(props.params.id)) || {name: "N/A"};
    const owners = ['Thor', 'Fandral', 'Hogun', 'Volstagg', 'Sif'];
    const deductions = [
        {id: '1', name: 'Sprint Ceremonies'},
        {id: '2', name: 'Vacations'},
        {id: '3', name: 'KTLO'},
        {id: '4', name: 'Misc'}
];

    const updateSprintData = async (formData: FormData) => {
        "use server";
        dlog()
        const data = JSON.parse(formData.get('sprintData') as string);
        const repository = new SQLLiteSprintOwnerCommitmentRepository()

        const dataRows = data.filter((row: any) => row.subject != 'totals' && row.subject != 'Summary')
        console.log('>> Processing dataRows:', dataRows);

        for (const row of dataRows) {
            const { subject: deductionId, acc, ...ownerData } = row;
            console.log(`Processing deductionId: ${deductionId}`);
            console.log('Owner data:', ownerData);

            for (const [ownerId, commited] of Object.entries(ownerData)) {
                const sprintOwnerCommitment: ISprintOwnerCommitment = {
                    sprintId: props.params.id,
                    ownerId,
                    deductionId: parseInt(deductionId),
                    commited: Number(commited)
                };
                console.log('Upserting commitment:', sprintOwnerCommitment);
                await repository.upsert(sprintOwnerCommitment);
            }
        }

        revalidatePath("/sprint");
        redirect("/sprint");
    }

    const sprintConstraints = await retrieveSprintData(deductions, props);

    const resetSprintData = async () => {
        "use server";
        revalidatePath(`/sprint/${ props.params.id }`);
        redirect(`/sprint/${ props.params.id }`);
    }

    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <h1>Edit Sprint</h1>
            <h3 className=" text-center mt-4">{name}</h3>
            <HydrateGlobalStore>
                <MatrixFormGrid y={deductions}
                                matrixFormAction={updateSprintData}
                                initialData={sprintConstraints}
                                addtionalActions={[
                                    {'name': 'Reset', 'action': resetSprintData},
                                ]}
                />
            </HydrateGlobalStore>
        </div>
    )
}