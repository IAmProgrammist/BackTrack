import { TextWithIcon } from "shared/ui/TextWithIcon"
import type { PlaylistItemProps } from "./types"
import "./styles.css"

export const PlaylistItem = ({imageURL, name, id: _id}: PlaylistItemProps) => {
    return <TextWithIcon imageURL={imageURL} title={name} className="playlistitem"/>
}