import type { HTMLAttributes } from "react";
import type { ControllerProps } from "react-hook-form";

export interface ControlledSongsWithTagSelectProps {
    containerProps?: HTMLAttributes<HTMLDivElement>
    controlProps: Omit<ControllerProps, "render" | "control">
}