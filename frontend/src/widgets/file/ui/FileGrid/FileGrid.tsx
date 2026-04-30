import { File } from "shared/ui/File/File"
import "./styles.css"
import type { FileGridProps } from "./types"

export const FileGrid = ({files}: FileGridProps) => {
    return <div className="filegrid">
        {files.map((file, idx) => <File key={idx} name={file.name} mimeType={file.mime} url={file.url}/>)}
    </div>
}