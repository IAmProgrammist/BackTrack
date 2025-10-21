import { Controller, useFormContext, useWatch } from "react-hook-form"
import type { ControlledTextareaInputProps } from "./types";
import { Textarea } from "../Textarea";

export const ControlledTextareaInput = ({inputProps, controlProps}: ControlledTextareaInputProps) => {
    const {control} = useFormContext();
    useWatch({name: controlProps.name, control});
    
    return <Controller
        {...controlProps}
        control={control}
        render={({ field: { onChange, value, ref}, fieldState: {error} }) => {
        return <Textarea {...inputProps} name={controlProps.name} value={value} onChange={onChange} ref={ref} error={error?.message}/>
    }}/>
}