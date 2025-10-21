import type { ControllerProps } from "react-hook-form";
import type { InputProps } from "../Input";

export interface ControlledCheckboxInputProps {
    inputProps?: InputProps
    controlProps: Omit<ControllerProps, "render" | "control">
}