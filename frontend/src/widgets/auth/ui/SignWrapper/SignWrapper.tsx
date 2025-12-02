import { Suspense } from "react"
import { Outlet } from "react-router"
import "./styles.css"
import { Card } from "shared/ui/Card"

export const SignWrapper = () => {
    return <div className="signpage">
        <Card className="signpage-logincard">
            <Suspense fallback="Загрузка...">
                <Outlet/>
            </Suspense>
        </Card>
    </div>
}

/*
export const PageWrapper = () => {
    return <>
        <Header/>
        <div className="page">
            <div className="page-wrapper">
                <Suspense fallback="Загрузка...">
                    <Outlet/>
                </Suspense>
            </div>
            <Footer/>
        </div>
        <Player/>
    </>
}
*/