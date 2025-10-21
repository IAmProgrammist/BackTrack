import { useQuery } from "@tanstack/react-query";
import { SONG_QUERY_KEY } from "entities/song/model/query-key";
import { useSongsService } from "features/song/lib/useSongsService";
import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Button } from "shared/ui/Button";
import { ControlledTextInput } from "shared/ui/ControlledTextInput/ControlledTextInput";
import { Select } from "shared/ui/Select";
import "./styles.css"
import { MdDelete } from "react-icons/md";
import type { ControlledSongsWithTagSelectProps } from "./types";
import clsx from "clsx";

export const ControlledSongsWithTagSelect = ({controlProps, containerProps = {}}: ControlledSongsWithTagSelectProps) => {
    const methods = useFormContext();
    const name = controlProps.name;
    useWatch({control: methods.control, name})

    const [songsStorage, setSongsStorage] = useState<{[key in string]: {
        name: string,
        authors: {id: string, name: string}[],
        groups: {id: string, name: string}[],
    }}>({});

    const {service} = useSongsService();
    const {data: songs = []} = useQuery({
        queryKey: [SONG_QUERY_KEY],
        queryFn: service.getSongs()
    })

    const songSelected = (songId: string) => {
        service.getSong(songId)().then((fetchedSong) => {
            setSongsStorage({...songsStorage, [songId]: {...fetchedSong}})
            methods.setValue(name, [...(methods.getValues(name) || []), {id: songId, tag: ""}])
        })
        .catch(e => console.error("Couldn't fetch song ", e))
    }

    const songRemoved = (index: number) => {
        methods.setValue(name, methods.getValues(name).filter((_: unknown, songIndex: number) => index !== songIndex))
    }

    return <div {...containerProps} className={clsx(containerProps?.className, "songs-with-tag-select")}>
        <Select subText="Песни" value={["-1"]} className="songs-with-tag-select-song-finder" onChange={(ev) => {
            songSelected(ev.target.value)
        }} options={[{children: "Выберите песню из списка", disabled: true, value: "-1"}, ...songs?.map((song) => ({
                    children: `${song.groups.map((gr) => gr.name).join(", ")}; ${song.authors.map((au) => au.name).join(", ")} - ${song.name}`,
                    value: song.id
                }))]}/>
        <Controller 
            control={methods.control}
            name={name}
            render={({field: {value}, fieldState: {error}}) => {
            return <div className="songs-with-tag-select-song-list">
                {value?.map((songData: {id: string, tag: string}, index: number) => {
                    if (!songsStorage[songData.id]) {
                        service.getSong(songData.id)().then((songFetched) => {
                            setSongsStorage({...songsStorage, [songData.id]: {...songFetched}})
                        }).catch((e) => console.error("Failed to fetch a song ", e))

                        return <><hr/><div className="songs-with-tag-select-song-item" key={index}>
                            Трек загружается...
                        </div></>
                    }
                    
                    return <><hr/><div className="songs-with-tag-select-song-item" key={index}>
                    {(() => {
                        const song = songsStorage[songData.id];
                        return `${song.groups.map((gr) => gr.name).join(", ")}; ${song.authors.map((au) => au.name).join(", ")} - ${song.name}`
                    })()}
                    <ControlledTextInput inputProps={{placeholder: "Фильтр по тегу"}} controlProps={{name: `${name}.${index}.tagSelector`}}/>
                    <Button equated onClick={() => songRemoved(index)}><MdDelete/></Button>
                </div></>})}
                {error}
            </div>}}/>
    </div>
}