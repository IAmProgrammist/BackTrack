import { useQuery } from "@tanstack/react-query";
import { PLAYLIST_QUERY_KEY } from "entities/playlist/model/query-key";
import { usePlaylistsService } from "features/playlists/lib/usePlaylistsService";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "shared/ui/Button";
import { ControlledFileInput } from "shared/ui/ControlledFileInput/ControlledFileInput";
import { ControlledTextInput } from "shared/ui/ControlledTextInput/ControlledTextInput";
import { Mutate } from "widgets/mutate/ui/Mutate"
import { ControlledSongsWithTagSelect } from "widgets/song/ui/ControlledSongsWithTagSelect/ControlledSongsWithTagSelect";

export const EditPlaylistPage = () =>  {
    const {service} = usePlaylistsService();
    const navigate = useNavigate();
    const {playlistId = ""} = useParams(); 
    
    return <Mutate title="Создать плейлист" mutationFn={(data) => service.updatePlaylist(playlistId, data)()} yupSchema={service.createSchema()} onSuccess={(data) => navigate(`/playlists/view/${data.id}`)}>
        <EditPlaylistFormPage/>
    </Mutate>
}


export const EditPlaylistFormPage = () => {
    const {playlistId = ""} = useParams(); 
    const {setValue} = useFormContext();
    const {service} = usePlaylistsService();
    
    const {data: playlistData} = useQuery({
        queryKey: [PLAYLIST_QUERY_KEY, playlistId],
        queryFn: () => service.getPlaylist(playlistId)()
    })

    useEffect(() => {
        if (!playlistData) return;
        
        setValue("name", playlistData.name);
        setValue("description", playlistData.description);
        setValue("songs", playlistData.tracks.map((song) => ({id: song.id, tagSelector: song.tagSelector})));
    }, [playlistData])

    return <>
        <ControlledTextInput controlProps={{name: "name"}} inputProps={{subText: "Имя"}}/>
        <ControlledTextInput controlProps={{name: "description"}} inputProps={{subText: "Описание"}}/>
        <ControlledSongsWithTagSelect controlProps={{name: "songs"}}/>
        <ControlledFileInput controlProps={{name: "icon"}} inputProps={{subText: "Картинка", type: "file"}}/>

        <div><Button type="submit">Обновить</Button></div>
    </>
}