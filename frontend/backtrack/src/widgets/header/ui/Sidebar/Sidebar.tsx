import clsx from "clsx"
import "./sidebar.css"
import type { SidebarProps } from "./types"
import { SidebarLink } from "../SidebarLink/SidebarLink"

export const Sidebar = ({opened}: SidebarProps) => {
    return <section className={clsx("sidebar", opened && "sidebar--opened")}>
        <nav className="sidebar-content">
            <SidebarLink to={"/"}>
                Главная страница
            </SidebarLink>
            <SidebarLink to={"/authors"}>
                Авторы
            </SidebarLink>
            <SidebarLink to={"/groups"}>
                Авторы
            </SidebarLink>
            <SidebarLink to={"/playlists"}>
                Плейлисты
            </SidebarLink>
            <SidebarLink to={"/songs"}>
                Песни
            </SidebarLink>
        </nav>
    </section>
}