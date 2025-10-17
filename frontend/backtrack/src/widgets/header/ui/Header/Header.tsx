import { useMediaQuery } from "react-responsive"
import "./header.css"
import { MdMenu } from "react-icons/md"
import { Button } from "../../../../shared/ui/Button"
import { Logo } from "../../../../shared/ui/Logo"
import { Input } from "../../../../shared/ui/Input"
import { Avatar } from "../../../../shared/ui/Avatar/Avatar"
import { useState } from "react"
import { Sidebar } from "../../../sidebar/ui/Sidebar"

export const Header = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isMobile = useMediaQuery({
        query: "(max-width: 720px)"
    })

    return <><header className="header">
        <Button onClick={() => setSidebarOpen(!sidebarOpen)} equated className="header-menu"><MdMenu/></Button>
        <Logo size={isMobile ? "small" : "large"}/>
        <Input placeholder="Поиск..."/>
        <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDjnosIvnhNdSTKDT8jzE9Nr7HDqmZ3s2Akw&s"/>
    </header>
    <Sidebar opened={sidebarOpen}/>
    </>
}