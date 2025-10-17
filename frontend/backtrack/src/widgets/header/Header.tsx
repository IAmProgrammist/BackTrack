import { useMediaQuery } from "react-responsive"
import { Avatar } from "../../shared/ui/Avatar/Avatar"
import { Input } from "../../shared/ui/Input"
import { Logo } from "../../shared/ui/Logo"
import "./header.css"

export const Header = () => {
    const isMobile = useMediaQuery({
        query: "(max-width: 720px)"
    })

    return <header className="header">
        <Logo size={isMobile ? "small" : "large"}/>
        <Input placeholder="Поиск..."/>
        <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDjnosIvnhNdSTKDT8jzE9Nr7HDqmZ3s2Akw&s"/>
    </header>
}