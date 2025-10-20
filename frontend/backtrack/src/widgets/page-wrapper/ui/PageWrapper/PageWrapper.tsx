import { Suspense } from "react"
import { Outlet } from "react-router"
import { Header } from "../Header"
import { Footer } from "../Footer/Footer"
import "./page-wrapper.css"

export const PageWrapper = () => {
    return <>
        <Header/>
        <div className="page-wrapper">
            <Suspense fallback="Загрузка...">
                <Outlet/>
            </Suspense>
        </div>
        <Footer/>
    </>
}