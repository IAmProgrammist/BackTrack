import clsx from "clsx"
import "./sidebar.css"
import { SidebarLink } from "../SidebarLink/SidebarLink"
import { useHeaderService } from "features/header/lib/useHeaderService"

export const Sidebar = () => {
    const {sidebarOpen} = useHeaderService();

    return <section className={clsx("sidebar", sidebarOpen && "sidebar--opened")}>
        <nav className="sidebar-content">
            <SidebarLink to={"/"}>
                Главная страница
            </SidebarLink>
            <SidebarLink to={"/authors"}>
                Авторы
            </SidebarLink>
            <SidebarLink to={"/groups"}>
                Группы
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