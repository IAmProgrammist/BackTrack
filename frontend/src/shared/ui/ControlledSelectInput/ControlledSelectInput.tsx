import { Controller, useFormContext, useWatch } from "react-hook-form"
import type { ControlledTextInputProps } from "./types";
import { Select } from "../Select";

export const ControlledSelectInput = ({selectProps, controlProps}: ControlledTextInputProps) => {
    const {control} = useFormContext();
    useWatch({name: controlProps.name, control});
    
    return <Controller
        {...controlProps}
        control={control}
        render={({ field: { onChange, value, ref}, fieldState: {error} }) => {
        return <Select {...selectProps} name={controlProps.name} value={value} onChange={(ev) => {
            if (!selectProps?.multiple) {
                onChange(ev.target.value)
            } else {
                onChange([...ev.target.options].filter((option) => option.selected).map((option) => option.value))
            }
        }} ref={ref} error={error?.message}/>
    }}/>
}