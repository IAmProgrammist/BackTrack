import { Navigate, useRoutes } from "react-router"
import { PageWrapper } from "./PageWrapper"
import { HomePage } from "pages/home/ui/HomePage/HomePage"

export const Router = () => {
    const routes = useRoutes([
    {
      path: '/',
      element: <PageWrapper />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '*', element: <Navigate to='/' /> },
      ],
    },
  ])

  return <>{routes}</>
}