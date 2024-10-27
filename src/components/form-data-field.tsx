
"use client";
export default function FormDataField(props: { name:string, displayName?:string, value:number, desc?:string ,  onChange: (e: any) => void }) {

    return (
        <div className="mb-2">
            <div className="d-flex align-items-center">
                <div className="text-left me-2" style={{width: '25%'}}>
                    <label>{props.displayName || props.name}:</label>
                </div>
                <div style={{ width: '70%' }}>

                <input
                    type="number"
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}
                    className="form-control w-25"
                />
                </div>
            </div>
        </div>
    )
}
