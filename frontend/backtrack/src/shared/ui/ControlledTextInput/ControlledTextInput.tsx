import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Input } from "../Input";
import type { ControlledTextInputProps } from "./types";

export const ControlledTextInput = ({inputProps, controlProps}: ControlledTextInputProps) => {
    const {control} = useFormContext();
    useWatch({name: controlProps.name, control});
    
    return <Controller
        {...controlProps}
        control={control}
        render={({ field: { onChange, value, ref}, fieldState: {error} }) => {
        return <Input {...inputProps} value={value} onChange={onChange} ref={ref} error={error?.message}/>
    }}/>
}