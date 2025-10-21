import clsx from "clsx"
import type { AvatarProps } from "./types"
import "./avatar.css"

export const Avatar = ({text, src, size = "large", className, ...props}: AvatarProps) => {
    return <div {...props} className={clsx("avatar", className, size === "small" && "avatar--small")}>
        {src ? <img className="avatar-img" src={src}/> : 
        <div className="avatar-text">{text?.substring(0, 1)}</div>
        }
    </div>
}