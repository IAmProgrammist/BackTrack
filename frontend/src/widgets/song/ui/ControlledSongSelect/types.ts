import type { ControllerProps } from "react-hook-form"
import type { SelectProps } from "shared/ui/Select"

export interface ControlledAuthorSelectProps {
    selectProps?: SelectProps
    controlProps: Omit<ControllerProps, "render" | "control">
}