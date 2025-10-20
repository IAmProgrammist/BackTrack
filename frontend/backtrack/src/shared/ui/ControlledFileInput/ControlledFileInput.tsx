import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Input } from "../Input";
import type { ControlledFileInputProps } from "./types";

export const ControlledFileInput = ({inputProps, controlProps}: ControlledFileInputProps) => {
    const {control} = useFormContext();
    useWatch({name: controlProps.name, control});
    
    return <Controller
        {...controlProps}
        control={control}
        render={({ field: { onChange, ref}, fieldState: {error} }) => {
        return <Input {...inputProps} type="file" onChange={(ev) => onChange(Array.from(ev.target.files))} ref={ref} error={error?.message}/>
    }}/>
}