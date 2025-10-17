import clsx from "clsx"
import "./input.css"
import type { InputProps } from "./types"

export const Input = ({className, error, subText, ...props}: InputProps) => {
    return <div className={clsx("input", className, 
            error && "input--error")}>
        <input {...props} className="input-field"/>
        {error || subText ? <p className="input-sub">{error ?? subText}</p> : null}
    </div>
}