export interface SongProps {
    id: string
    name: string
    duration?: number | null
    authors: {id: string, name: string}[]
    groups: {id: string, name: string}[]
    redirect?: boolean
}