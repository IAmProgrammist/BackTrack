import type { HTMLAttributes } from "react";

export interface InputProps extends HTMLAttributes<HTMLInputElement> {
    placeholder?: string,
    error?: string,
    subText?: string
}