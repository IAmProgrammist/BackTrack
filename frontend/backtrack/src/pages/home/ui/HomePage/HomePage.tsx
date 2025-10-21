import { AuthorsGrid } from "widgets/author/ui/AuthorsGrid/AuthorsGrid";
import "./home-page.css"
import { GroupsGrid } from "widgets/group/ui/GroupsGrid/GroupsGrid";
import { PlaylistsGrid } from "widgets/playlist/ui/PlaylistsGrid";
import { SongsGrid } from "widgets/song/ui/SongsGrid";

export const HomePage = () => {
    return <div className="home-page">
        <GroupsGrid/>
        <AuthorsGrid/>
        <PlaylistsGrid/>
        <SongsGrid/>
    </div>
}