import clsx from "clsx"
import "./button.css"
import type { ButtonProps } from "./types"

export const Button = ({className, equated = false, ...props}: ButtonProps) => {
    return <button {...props} className={clsx("button", className, equated && "button--equated")}/>
}