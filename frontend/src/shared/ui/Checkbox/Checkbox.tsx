import clsx from "clsx"
import "./styles.css"
import type { CheckboxProps } from "./types"

export const Checkbox = ({className, error, subText, ...props}: CheckboxProps) => {
    return <div className={clsx("checkbox", className, 
            error && "checkbox--error")}>
        <div className="checkbox-container">
            <input {...props} type="checkbox" className="checkbox-field"/>
            {subText ? <label htmlFor={props.name} className="checkbox-sub">{subText}</label> : null}
        </div>
        {error ? <p className="checkbox-sub">{error}</p> : null}
    </div>
}