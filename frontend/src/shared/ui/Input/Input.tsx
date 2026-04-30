import clsx from "clsx"
import "./input.css"
import type { InputProps } from "./types"

export const Input = ({className, error, subText, ...props}: InputProps) => {
    return <div className={clsx("input", className, 
            error && "input--error")}>
        {subText ? <p className="input-sub">{subText}</p> : null}
        <input {...props} className="input-field"/>
        {error ? <p className="input-sub">{error}</p> : null}
    </div>
}