import { Avatar } from "../../../../shared/ui/Avatar/Avatar"
import { Button } from "../../../../shared/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/ui/Card"
import "./group-header.css"
import type { GroupHeaderProps } from "./types"

export const GroupHeader = ({name, imageURL, description, participants}: GroupHeaderProps) => {
    return <Card className="group group--big">
        <CardHeader className="group-header">
            <img src={imageURL}/>
            <CardTitle className="group-title">
                <h3>{name}</h3>
                <Button>Редактировать</Button>
            </CardTitle>
        </CardHeader>
        <CardContent className="group-content">
            <p className="group-desciption">
                {description}
            </p>
            <div className="group-participants">
                <div className="group-participants-text">Участники:</div>
                {participants.map((it) => (<Avatar src={it.imageURL}/>))}
            </div>
        </CardContent>
    </Card>
}