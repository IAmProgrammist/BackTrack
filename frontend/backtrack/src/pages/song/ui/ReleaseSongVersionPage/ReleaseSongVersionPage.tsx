import { useQuery } from "@tanstack/react-query";
import { SONG_VERSIONS_QUERY_KEY } from "entities/song/model/query-key";
import { useSongsService } from "features/song/lib/useSongsService";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Button } from "shared/ui/Button";
import { ControlledTextareaInput } from "shared/ui/ControlledTextareaInput/ControlledTextareaInput";
import { ControlledTextInput } from "shared/ui/ControlledTextInput/ControlledTextInput";
import { ControlledAuthorSelect } from "widgets/author/ui/ControlledAuthorSelect";
import { ControlledGroupSelect } from "widgets/group/ui/ControlledGroupSelect";
import { Mutate } from "widgets/mutate/ui/Mutate"
import { ControlledFileWithLeadingSelect } from "widgets/song/ui/ControlledFileWithLeadingSelect/ControlledFileWithLeadingSelect";

export const ReleaseSongVersionPage = () =>  {
    const {songId = ""} = useParams();
    const {service} = useSongsService();
    const navigate = useNavigate();
    
    return <Mutate 
    title="Выпустить новую версию песни" 
    mutationFn={(data) => service.releaseSongVersion(songId, data)()} 
    yupSchema={service.releaseSchema()} 
    onSuccess={(data) => navigate(`/songs/view/${data.id}?version=${data.version}`)}>
        <ReleaseSongVersionFormPage/>
    </Mutate>
}


export const ReleaseSongVersionFormPage = () => {
    const {songId = ""} = useParams();
    const [searchParams] = useSearchParams();
    const version = searchParams.get("version");
    const {setValue} = useFormContext();
    const {service} = useSongsService();
    
    const {data: songData} = useQuery({
        queryKey: [SONG_VERSIONS_QUERY_KEY, songId, version],
        queryFn: () => service.getSong(songId, version || undefined)()
    })

    useEffect(() => {
        if (!songData) return;
        
        setValue("name", songData.name);
        setValue("description", songData.description);
        setValue("bpm", songData.bpm);
        setValue("songKey", songData.songKey);
        setValue("lyrics", songData.lyrics);
        setValue("groups", songData.groups.map((group) => group.id));
        setValue("authors", songData.authors.map((author) => author.id));
    }, [songData])

    return <>
        <ControlledTextInput controlProps={{name: "name"}} inputProps={{subText: "Имя"}}/>
        <ControlledTextInput controlProps={{name: "tag"}} inputProps={{subText: "Тэг"}}/>
        <ControlledTextInput controlProps={{name: "description"}} inputProps={{subText: "Описание"}}/>
        <ControlledTextInput controlProps={{name: "bpm"}} inputProps={{subText: "BPM (удары в минуту)"}}/>
        <ControlledTextInput controlProps={{name: "songKey"}} inputProps={{subText: "Тональность"}}/>
        <ControlledTextareaInput controlProps={{name: "lyrics"}} inputProps={{subText: "Слова", rows: 10}}/>
        <ControlledFileWithLeadingSelect controlProps={{name: "files"}}/>
        <ControlledGroupSelect controlProps={{name: "groups"}} selectProps={{subText: "Группы", multiple: true}}/>
        <ControlledAuthorSelect controlProps={{name: "authors"}} selectProps={{subText: "Авторы", multiple: true}}/>

        <div><Button type="submit">Выпустить версию</Button></div>
    </>
}