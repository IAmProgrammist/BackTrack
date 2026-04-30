import { Link } from "react-router"
import clsx from "clsx"
import type { SidebarLinkProps } from "./types"
import "./sidebar-link.css"

export const SidebarLink = ({className, ...props}: SidebarLinkProps) => {
    return <Link {...props} className={clsx("sidebar-link", className)}/>
}