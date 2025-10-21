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
import { GroupPage } from "pages/group/ui/GroupPage"
import { AddGroupPage } from "pages/group/ui/AddGroupPage/AddGroupPage"
import { EditGroupPage } from "pages/group/ui/EditGroupPage/EditGroupPage"
import { PlaylistPage } from "pages/playlist/ui/PlaylistPage"
import { AddPlaylistPage } from "pages/playlist/ui/AddPlaylistPage/AddPlaylistPage"
import { EditPlaylistPage } from "pages/playlist/ui/EditPlaylistPage/EditPlaylistPage"
import { SongPage } from "pages/song/ui/SongPage"
import { AddSongPage } from "pages/song/ui/AddSongPage"
import { ReleaseSongVersionPage } from "pages/song/ui/ReleaseSongVersionPage"

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
        { path: '/groups/view/:groupId', element: <GroupPage /> },
        { path: '/groups/create', element: <AddGroupPage/> },
        { path: '/groups/update/:groupId', element: <EditGroupPage/> },
        { path: '/playlists', element: <PlaylistsPage /> },
        { path: '/playlists/view/:playlistId', element: <PlaylistPage /> },
        { path: '/playlists/update/:playlistId', element: <EditPlaylistPage /> },
        { path: '/playlists/create', element: <AddPlaylistPage /> },
        { path: '/songs', element: <SongsPage /> },
        { path: '/songs/view/:songId', element: <SongPage /> },
        { path: '/songs/create', element: <AddSongPage /> },
        { path: '/songs/release/:songId', element: <ReleaseSongVersionPage /> },
        { path: '*', element: <Navigate to='/' /> },
      ],
    },
  ])

  return <>{routes}</>
}