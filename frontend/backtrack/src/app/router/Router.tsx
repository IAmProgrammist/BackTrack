import { Navigate, useRoutes } from "react-router"
import { HomePage } from "pages/home/ui/HomePage/HomePage"
import { PageWrapper } from "widgets/page-wrapper/ui/PageWrapper/PageWrapper"
import { AuthorsPage } from "pages/home/ui/AuthorsPage"
import { GroupsPage } from "pages/home/ui/GroupsPage"
import { PlaylistsPage } from "pages/home/ui/PlaylistsPage"
import { SongsPage } from "pages/home/ui/SongsPage"

export const Router = () => {
    const routes = useRoutes([
    {
      path: '/',
      element: <PageWrapper />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/authors', element: <AuthorsPage /> },
        { path: '/groups', element: <GroupsPage /> },
        { path: '/playlists', element: <PlaylistsPage /> },
        { path: '/songs', element: <SongsPage /> },
        { path: '*', element: <Navigate to='/' /> },
      ],
    },
  ])

  return <>{routes}</>
}