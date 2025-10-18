import { TextWithIcon } from "../../../../shared/ui/TextWithIcon"
import type { SongItemProps } from "./types"
import "./song-item.css"

export const SongItem = ({imageURL, name, id}: SongItemProps) => {
    return <TextWithIcon imageURL={imageURL} title={name} className="song-item"/>
}