import type { HTMLAttributes } from "react";

export interface SliderProps extends HTMLAttributes<HTMLDivElement> {
    progress: number
    onProgressChange: (progress: number) => void
}