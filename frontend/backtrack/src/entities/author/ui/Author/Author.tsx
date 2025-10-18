import { useNavigate } from "react-router"
import { Avatar } from "shared/ui/Avatar/Avatar"
import { Card, CardHeader, CardTitle } from "shared/ui/Card"
import "./author.css"
import type { AuthorProps } from "./types"

export const Author = ({id, name, imageURL, redirect = false}: AuthorProps) => {
    const navigate = useNavigate();

    return <Card clickable={redirect} onClick={() => {
        if (!redirect) return;

        navigate(`/authors/${id}/view`)
    }} className="author author--small">
        <CardHeader className="author-header">
            <Avatar src={imageURL}/>
        </CardHeader>
        <CardTitle className="author-title">
            {name}
        </CardTitle>
    </Card>
}