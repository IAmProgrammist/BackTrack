import type { HTMLAttributes } from "react";

export type CardVariant = "primary" | "outlined"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    clickable?: boolean
    variant?: CardVariant
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardTitleProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}
