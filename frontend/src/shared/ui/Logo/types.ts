import type { HTMLAttributes } from "react";

export interface LogoProps extends Exclude<HTMLAttributes<HTMLAnchorElement>, "children"> {
    size?: "small" | "large"
}