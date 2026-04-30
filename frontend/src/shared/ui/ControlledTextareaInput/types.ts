import type { ControllerProps } from "react-hook-form";
import type { TextareaProps } from "../Textarea";

export interface ControlledTextareaInputProps {
    inputProps?: TextareaProps
    controlProps: Omit<ControllerProps, "render" | "control">
}