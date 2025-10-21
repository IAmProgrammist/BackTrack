import { usePlaylistsService } from "features/playlists/lib/usePlaylistsService";
import { useNavigate } from "react-router";
import { Button } from "shared/ui/Button";
import { ControlledFileInput } from "shared/ui/ControlledFileInput/ControlledFileInput";
import { ControlledTextInput } from "shared/ui/ControlledTextInput/ControlledTextInput";
import { Mutate } from "widgets/mutate/ui/Mutate"
import { ControlledSongsWithTagSelect } from "widgets/song/ui/ControlledSongsWithTagSelect/ControlledSongsWithTagSelect";

export const AddPlaylistPage = () =>  {
    const {service} = usePlaylistsService();
    const navigate = useNavigate();
    
    return <Mutate title="Создать плейлист" mutationFn={(data) => service.createPlaylist(data)()} yupSchema={service.createSchema()} onSuccess={(data) => navigate(`/playlists/view/${data.id}`)}>
        <ControlledTextInput controlProps={{name: "name"}} inputProps={{subText: "Имя"}}/>
        <ControlledTextInput controlProps={{name: "description"}} inputProps={{subText: "Описание"}}/>
        <ControlledSongsWithTagSelect controlProps={{name: "songs"}}/>
        <ControlledFileInput controlProps={{name: "icon"}} inputProps={{subText: "Картинка", type: "file"}}/>

        <div><Button type="submit">Создать</Button></div>
    </Mutate>
}