import { useNavigate } from "react-router"
import { Card, CardHeader, CardTitle } from "shared/ui/Card"
import "./group.css"
import type { GroupProps } from "./types"

export const Group = ({id, name, imageURL, redirect = false}: GroupProps) => {
    const navigate = (v: string) => {}//useNavigate();
    
    return <Card clickable={redirect} onClick={() => {
        if (!redirect) return;

        navigate(`/groups/${id}/view`);
    }} className="group group--small">
        <CardHeader className="group-header">
            <img src={imageURL}/>
        </CardHeader>
        <CardTitle className="group-title">
            {name}
        </CardTitle>
    </Card>
}