import { Card, CardContent, CardTitle } from "shared/ui/Card"
import "./styles.css"
import type { CommentProps } from "./types"

export const Comment = ({author, date, content}: CommentProps) => {
    return <Card variant="outlined" className="comment">
        <CardTitle className="comment-title">
            <h5 className="comment-author">{author}</h5>
            <div className="comment-date">{new Date(date).toLocaleDateString()}</div>
        </CardTitle>
        <CardContent className="comment-content">
            {content}
        </CardContent>
    </Card>
}