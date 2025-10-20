import { AuthorsGrid } from "widgets/authors-grid/ui/AuthorsGrid/AuthorsGrid";
import "./home-page.css"
import { GroupsGrid } from "widgets/groups-grid/ui/GroupsGrid/GroupsGrid";
import { PlaylistsGrid } from "widgets/playlists-grid/ui/PlaylistsGrid";
import { SongsGrid } from "widgets/songs-grid/ui/SongsGrid";

export const HomePage = () => {
    return <div className="home-page">
        <GroupsGrid/>
        <AuthorsGrid/>
        <PlaylistsGrid/>
        <SongsGrid/>
    </div>
}