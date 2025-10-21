import { Controller, useFormContext, useWatch } from "react-hook-form"
import type { ControlledCheckboxInputProps } from "./types";
import { Checkbox } from "../Checkbox";

export const ControlledCheckboxInput = ({inputProps, controlProps}: ControlledCheckboxInputProps) => {
    const {control} = useFormContext();
    let value = useWatch({name: controlProps.name, control});
    
    return <Controller
        {...controlProps}
        control={control}
        render={({ field: { onChange, ref}, fieldState: {error} }) => {
        return <Checkbox {...inputProps} 
            name={controlProps.name} 
            checked={value} 
            onChange={(ev) => onChange(ev.target.checked)} 
            ref={ref}
            error={error?.message}/>
    }}/>
}