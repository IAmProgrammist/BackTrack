export interface SongTableProps {
    tracks: {id: string, name: string, groups: {id: string, name: string}[], authors: {id: string, name: string}[], duration?: number | null}[]
}