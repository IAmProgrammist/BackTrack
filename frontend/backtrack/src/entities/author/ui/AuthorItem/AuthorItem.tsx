import { TextWithIcon } from "shared/ui/TextWithIcon"
import type { AuthorItemProps } from "./types"
import "./styles.css"

export const AuthorItem = ({imageURL, name, id: _id}: AuthorItemProps) => {
    return <TextWithIcon imageURL={imageURL} title={name} className="groupitem"/>
}