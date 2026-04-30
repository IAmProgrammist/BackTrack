import type { CardContentProps, CardHeaderProps, CardProps, CardTitleProps } from "./types"
import clsx from "clsx"
import "./card.css"

export const Card = ({clickable = false, variant = "primary", ...props}: CardProps) => {
    return <div {...props} className={clsx(
        "card", 
        variant === "outlined" && "card--outlined",
        clickable && "card--clickable", 
        props.className)}/>
}

export const CardHeader = ({className, ...props}: CardHeaderProps) => {
    return <div {...props} className={clsx("card-header", className)}/>
}

export const CardTitle = ({className, ...props}: CardTitleProps) => {
    return <div {...props} className={clsx("card-title", className)}/>
}

export const CardContent = ({className, ...props}: CardContentProps) => {
    return <div {...props} className={clsx("card-content", className)}/>
}