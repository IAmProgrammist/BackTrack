import { Textarea } from "shared/ui/Textarea"
import "./styles.css"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query";
import { SONG_COMMENT_KEY } from "entities/song/model/query-key";
import type { CommentsListProps } from "./types";
import { useSongsService } from "features/song/lib/useSongsService";
import { Comment } from "entities/comment/ui/Comment";
import { Button } from "shared/ui/Button";
import { MdSend } from "react-icons/md";

export const CommentsList = ({id}: CommentsListProps) => {
    const [comment, setComment] = useState("");
    const {service} = useSongsService();
    const {data: comments, isError, isLoading} = useQuery({
        queryKey: [SONG_COMMENT_KEY, id],
        queryFn: service.getComments(id)
    })

    if (isError) {
        return "Не удалось загрузить комментарии"
    } else if (isLoading) {
        return "Загрузка..."
    }
    
    return <div className="songcomments">
        <div className="songcomments-list">
            {comments?.map((it) => <Comment key={it.id} author={it.userName} content={it.content} date={it.createdAt}/>) || "Комментариев пока никто не оставил - будьте первым!"}
        </div>
        <div className="songcomments-controls">
            <Textarea placeholder="Введите комментарий..." className="songcomments-input" value={comment} onChange={(ev) => setComment(ev.target.value)}/>
            <Button equated><MdSend/></Button>
        </div>
    </div>
}