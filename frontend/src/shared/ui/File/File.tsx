import clsx from "clsx";
import type { FileProps } from "./types";
import { MdDownload, MdFileCopy } from "react-icons/md";
import "./styles.css"

export const File = ({
        name,
        url,
        mimeType,
        className,
        ...props
}: FileProps) => {
        return <div {...props} className={clsx("file", className)}>
            <a target="_blank" download href={url} className="file-preview">
                <MdDownload className="file-preview-downloader"/>
                {mimeType.startsWith("image") ? <img className="file-preview-image" src={url}/> : <MdFileCopy className="file-preview-image"/>}
            </a>
            <div className="file-name">
                {name}
            </div>
        </div>
}