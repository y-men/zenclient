
"use client";
export default function FormDataField(props: { name:string, displayName?:string, value:number, desc?:string ,  onChange: (e: any) => void }) {

    return <div className="flex flex-col mb-4">
        <div className="flex items-center">
            <div className="w-1/2 text-left">
                <label>{props.displayName || props.name }:</label>
            </div>
            <input
                type="number"
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                className="border rounded p-2 w-1/6"
            />
        </div>
        {props.desc && <small style={{fontStyle: "italic", display: "block"}}>{props.desc}</small>}
    </div>
}
