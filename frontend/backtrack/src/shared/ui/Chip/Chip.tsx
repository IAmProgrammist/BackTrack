import clsx from "clsx";
import type { ChipProps } from "./types";

export const Chip = ({className, ...props}: ChipProps) => {
    return <div {...props} className={clsx("chip", className)}/>
}