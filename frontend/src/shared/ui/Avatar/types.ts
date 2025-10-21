import type { HTMLAttributes } from "react";

export interface AvatarProps extends Exclude<HTMLAttributes<HTMLDivElement>, "children"> {
    text?: string
    src?: string
    size?: "large" | "small"
} 