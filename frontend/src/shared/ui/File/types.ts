import type { HTMLAttributes } from "react"

export interface FileProps extends HTMLAttributes<HTMLDivElement> {
    name: string
    url: string
    mimeType: string
}