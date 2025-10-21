import { useSongsService } from "features/song/lib/useSongsService";
import { useNavigate } from "react-router";
import { Button } from "shared/ui/Button";
import { ControlledTextareaInput } from "shared/ui/ControlledTextareaInput/ControlledTextareaInput";
import { ControlledTextInput } from "shared/ui/ControlledTextInput/ControlledTextInput";
import { ControlledAuthorSelect } from "widgets/author/ui/ControlledAuthorSelect";
import { ControlledGroupSelect } from "widgets/group/ui/ControlledGroupSelect";
import { Mutate } from "widgets/mutate/ui/Mutate"
import { ControlledFileWithLeadingSelect } from "widgets/song/ui/ControlledFileWithLeadingSelect/ControlledFileWithLeadingSelect";

export const AddSongPage = () =>  {
    const {service} = useSongsService();
    const navigate = useNavigate();
    
    return <Mutate title="Создать плейлист" mutationFn={(data) => service.createSong(data)()} yupSchema={service.createSchema()} onSuccess={(data) => navigate(`/songs/view/${data.id}`)}>
        <ControlledTextInput controlProps={{name: "name"}} inputProps={{subText: "Имя"}}/>
        <ControlledTextInput controlProps={{name: "tag"}} inputProps={{subText: "Тэг"}}/>
        <ControlledTextInput controlProps={{name: "description"}} inputProps={{subText: "Описание"}}/>
        <ControlledTextInput controlProps={{name: "bpm"}} inputProps={{subText: "BPM (удары в минуту)"}}/>
        <ControlledTextInput controlProps={{name: "songKey"}} inputProps={{subText: "Тональность"}}/>
        <ControlledTextareaInput controlProps={{name: "lyrics"}} inputProps={{subText: "Слова", rows: 10}}/>
        <ControlledFileWithLeadingSelect controlProps={{name: "files"}}/>
        <ControlledGroupSelect controlProps={{name: "groups"}} selectProps={{subText: "Группы", multiple: true}}/>
        <ControlledAuthorSelect controlProps={{name: "authors"}} selectProps={{subText: "Авторы", multiple: true}}/>

        <div><Button type="submit">Создать</Button></div>
    </Mutate>
}