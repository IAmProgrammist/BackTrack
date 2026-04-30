import { useMediaQuery } from "react-responsive"
import "./header.css"
import { MdMenu } from "react-icons/md"
import { Button } from "../../../../shared/ui/Button"
import { Logo } from "../../../../shared/ui/Logo"
import { Input } from "../../../../shared/ui/Input"
import { Avatar } from "../../../../shared/ui/Avatar/Avatar"
import { useHeaderService } from "../../../../features/header/lib/useHeaderService"
import { Sidebar } from "../Sidebar"
import { useGetUserinfo } from "features/auth/ui/useAuth"
import { useNavigate } from "react-router"
import { useAuthService, useAuthToken } from "features/auth/ui/useAuthService"

export const Header = () => {
    const { service: headerService, ...headerVals } = useHeaderService();
    const isMobile = useMediaQuery({
        query: "(max-width: 720px)"
    })
    const {data: userData, isSuccess} = useGetUserinfo();
    const {token} = useAuthToken();
    const authService = useAuthService();
    const navigate = useNavigate();

    return <div>
        <header className="header">
            <Button onClick={() => headerService.setSidebarOpen(!headerVals.sidebarOpen)} equated className="header-menu"><MdMenu/></Button>
            <Logo size={isMobile ? "small" : "large"}/>
            <Input className="header-search" placeholder="Поиск..."/>
            {token === null && <Button onClick={() => navigate("/sign")}>Войти</Button>}
            {token !== null && isSuccess && <Avatar onClick={() => authService.logout()} text={userData.username}/>}
        </header>
        <Sidebar/>
    </div>
}