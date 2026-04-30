import { TextWithIcon } from "shared/ui/TextWithIcon"
import type { GroupItemProps } from "./types"
import "./styles.css"

export const GroupItem = ({imageURL, name, id: _id}: GroupItemProps) => {
    return <TextWithIcon imageURL={imageURL} title={name} className="groupitem"/>
}