import { Avatar } from "shared/ui/Avatar/Avatar"
import { Button } from "shared/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "shared/ui/Card"
import "./author-header.css"
import type { AuthorHeaderProps } from "./types"

export const AuthorHeader = ({name, imageURL, description}: AuthorHeaderProps) => {
    return <Card className="author author--big">
        <Avatar src={imageURL}/>
        <CardContent className="author-info">
            <CardTitle className="author-title">
                {name} <Button>Редактировать</Button>
            </CardTitle>
            <p>
                {description}
            </p>
        </CardContent>
    </Card>
}