import { Avatar } from "../Avatar/Avatar";
import type { TextWithIconProps } from "./types";
import "./text-with-icon.css"
import clsx from "clsx";

export const TextWithIcon = ({imageURL, title, subContent, subSubContent, className, ...props}: TextWithIconProps) => {
    return <div {...props} className={clsx("text-with-icon", className)}>
        <Avatar className="text-with-icon-avatar" src={imageURL}/>
        <div className="text-with-icon-content">
            <div className="text-with-icon-title">{title}</div>
            {subContent && <div className="text-with-icon-sub-content">{subContent}</div>}
            {subSubContent && <div className="text-with-icon-sub-sub-content">{subSubContent}</div>}
        </div>
    </div>
}