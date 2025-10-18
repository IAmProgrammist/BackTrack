import { Suspense } from "react"
import { Outlet } from "react-router"
import { Header } from "widgets/header/ui/Header"

export const PageWrapper = () => {
    return <>
        <Header/>
        <Suspense fallback="Загрузка...">
            <Outlet/>
        </Suspense>
    </>
}