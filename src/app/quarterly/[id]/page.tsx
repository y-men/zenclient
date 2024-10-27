import Link from "next/link";
import {HydrateGlobalStore} from "@/components/hydrate-store";
import QuarterlyPlanningGrid from "@/app/quarterly/quarterly-planning-grid";
import {saveQuarterlyPlan} from "@/actions";
import {SQLLiteQuarterOwnerCommitmentRepository, SQLLiteQuartersRepository} from "@/db";

// TODO Consider as a common component
// TODO refactor: Add all the styles to the css file and use in all the nav items
const SecondaryNav = () => {
    return (
        <div className="ms-auto">
            <Link href="/quarterly/" className="nav-link p-0 pe-2">
                All Plans
            </Link>
        </div>
    )
}
const quartersRepository = new SQLLiteQuartersRepository()
const quarterOwnerCommitmentRepository = new SQLLiteQuarterOwnerCommitmentRepository()

// @ts-ignore
// eslint-disable-next-line react/display-name,import/no-anonymous-default-export
export  default async({params}) => {
    const qp = await quartersRepository.getById(params.id);
    const commitments = await quarterOwnerCommitmentRepository.getCommitmentsByQuarter(params.id);

    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <SecondaryNav/>
            <h1>Edit Quarterly Plan</h1>
            <HydrateGlobalStore>
                <QuarterlyPlanningGrid
                    // month={qp?.year as 'Jan' | 'Apr' | 'Jul' | 'Oct' ?? 'Jan'}
                    // TODO refactor: Use the correct enum
                    quarter={qp?.quarter as  'Q1' | 'Q2' | 'Q3' | 'Q4'  ?? 'Q1'}
                    year={Number(qp?.year) ?? 2024}
                    quarterSelectionDisabled={true}
                    // @ts-ignore
                    commitments={commitments}
                    action={saveQuarterlyPlan}

                />
            </HydrateGlobalStore>

        </div>
    )
}

