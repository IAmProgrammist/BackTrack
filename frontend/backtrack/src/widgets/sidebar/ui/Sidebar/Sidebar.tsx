import clsx from "clsx"
import "./sidebar.css"
import type { SidebarProps } from "./types"

export const Sidebar = ({opened}: SidebarProps) => {
    return <section className={clsx("sidebar", opened && "sidebar--opened")}>
        <nav className="sidebar-content">
            Put navigation here
        </nav>
    </section>
}