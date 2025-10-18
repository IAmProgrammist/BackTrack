export interface SongProps {
    id: string
    name: string
    duration: number
    authors: [{id: string, name: string}]
    redirect?: boolean
}