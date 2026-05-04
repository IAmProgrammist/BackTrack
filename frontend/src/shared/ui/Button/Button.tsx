import clsx from "clsx"
import "./button.css"
import type { ButtonProps } from "./types"

export const Button = ({className, equated = false, chonk = false, ...props}: ButtonProps) => {
    return <button {...props} className={clsx("button", className, equated && "button--equated", chonk && "button--chonk")}/>
}