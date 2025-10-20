import { Navigate, useRoutes } from "react-router"
import { HomePage } from "pages/home/ui/HomePage/HomePage"
import { PageWrapper } from "widgets/page-wrapper/ui/PageWrapper/PageWrapper"
import { AuthorsPage } from "pages/author/ui/AuthorsPage"
import { GroupsPage } from "pages/group/ui/GroupsPage"
import { PlaylistsPage } from "pages/playlist/ui/PlaylistsPage"
import { SongsPage } from "pages/song/ui/SongsPage"
import { AuthorPage } from "pages/author/ui/AuthorPage/AuthorPage"
import { AddAuthorPage } from "pages/author/ui/AddAuthorPage/AddAuthorPage"
import { EditAuthorPage } from "pages/author/ui/EditAuthorPage/EditAuthorPage"

export const Router = () => {
    const routes = useRoutes([
    {
      path: '/',
      element: <PageWrapper />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/authors', element: <AuthorsPage /> },
        { path: '/authors/view/:authorId', element: <AuthorPage /> },
        { path: '/authors/update/:authorId', element: <EditAuthorPage /> },
        { path: '/authors/create', element: <AddAuthorPage /> },
        { path: '/groups', element: <GroupsPage /> },
        { path: '/playlists', element: <PlaylistsPage /> },
        { path: '/songs', element: <SongsPage /> },
        { path: '*', element: <Navigate to='/' /> },
      ],
    },
  ])

  return <>{routes}</>
}