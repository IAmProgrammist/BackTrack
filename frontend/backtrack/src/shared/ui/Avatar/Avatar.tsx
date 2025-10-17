import clsx from "clsx"
import type { AvatarProps } from "./types"
import "./avatar.css"

export const Avatar = ({text, src, className, ...props}: AvatarProps) => {
    return <div {...props} className={clsx("avatar", className)}>
        {src ? <img className="avatar-img" src={src}/> : 
        <div className="avatar-text">{text?.substring(0, 1)}</div>
        }
    </div>
}