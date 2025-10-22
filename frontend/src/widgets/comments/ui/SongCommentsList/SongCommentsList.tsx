import { Textarea } from "shared/ui/Textarea"
import "./styles.css"
import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query";
import { SONG_COMMENT_KEY } from "entities/song/model/query-key";
import type { SongCommentsListProps } from "./types";
import { useSongsService } from "features/song/lib/useSongsService";
import { Comment } from "entities/comment/ui/Comment";
import { Button } from "shared/ui/Button";
import { MdSend } from "react-icons/md";

export const CommentsList = ({id}: SongCommentsListProps) => {
    const [comment, setComment] = useState("");
    const {service} = useSongsService();
    const {data: comments, isError, isLoading} = useQuery({
        queryKey: [SONG_COMMENT_KEY, id],
        queryFn: service.getComments(id)
    })
    const {mutate: addComment} = useMutation({
        mutationFn: (data: unknown) => service.createComment(id, data)(),
        mutationKey: [SONG_COMMENT_KEY, id],
        onSuccess: () => {
            setComment("");
        }
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
            <Button equated onClick={() => addComment({content: comment})}><MdSend/></Button>
        </div>
    </div>
}