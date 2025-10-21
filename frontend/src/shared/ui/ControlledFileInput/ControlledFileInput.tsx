import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Input } from "../Input";
import type { ControlledFileInputProps } from "./types";
import { useEffect, useRef } from "react";

export const ControlledFileInput = ({inputProps, controlProps}: ControlledFileInputProps) => {
    const {control} = useFormContext();
    const inputRef = useRef<HTMLInputElement>(null);
    let value = useWatch({name: controlProps.name, control});

    useEffect(() => {
        if (inputRef.current) {
            const dataTransfer = new DataTransfer();
            (value || []).forEach((file: File) => dataTransfer.items.add(file));
            inputRef.current.files = dataTransfer.files;
        }
    }, [value])
    
    return <Controller
        {...controlProps}
        control={control}
        render={({ field: { onChange}, fieldState: {error} }) => {
        return <Input {...inputProps} name={controlProps.name} type="file" onChange={(ev) => onChange(Array.from(ev.target.files || []))} ref={inputRef} error={error?.message}/>
    }}/>
}