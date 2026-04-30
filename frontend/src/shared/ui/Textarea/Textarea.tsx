import clsx from "clsx"
import "./styles.css"
import type { TextareaProps } from "./types"

export const Textarea = ({className, error, subText, ...props}: TextareaProps) => {
    return <div className={clsx("textarea", className, 
            error && "textarea--error")}>
        {subText ? <p className="textarea-sub">{subText}</p> : null}
        <textarea {...props} className="textarea-field"/>
        {error ? <p className="textarea-sub">{error}</p> : null}
    </div>
}