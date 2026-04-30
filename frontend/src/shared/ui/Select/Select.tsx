import clsx from "clsx"
import "./select.css"
import type { SelectProps } from "./types"

export const Select = ({className, error, subText, options, ...props}: SelectProps) => {
    return <div className={clsx("select", className, 
            error && "select--error")}>
        {subText ? <p className="select-sub">{subText}</p> : null}
        <select {...props} className="select-field">
            {options?.map(({className, ...optionProps}) => <option {...optionProps} className={clsx(className, "select-option")}/>)}
        </select>
        {error ? <p className="select-sub">{error}</p> : null}
    </div>
}