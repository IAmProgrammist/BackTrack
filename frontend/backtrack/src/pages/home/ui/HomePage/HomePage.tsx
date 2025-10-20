import { AuthorsGrid } from "widgets/author/ui/AuthorsGrid/AuthorsGrid";
import "./home-page.css"
import { GroupsGrid } from "widgets/group/ui/GroupsGrid/GroupsGrid";
import { PlaylistsGrid } from "widgets/playlist/ui/PlaylistsGrid";
import { SongsGrid } from "widgets/songs-grid/ui/SongsGrid";
import { Slider } from "shared/ui/Slider";

export const HomePage = () => {
    return <div className="home-page">
        <GroupsGrid/>
        <AuthorsGrid/>
        <PlaylistsGrid/>
        <SongsGrid/>
    </div>
}