import type { ControllerProps } from "react-hook-form";
import type { SelectProps } from "../Select";

export interface ControlledTextInputProps {
    selectProps?: SelectProps
    controlProps: Omit<ControllerProps, "render" | "control">
}