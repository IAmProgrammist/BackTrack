export interface SongTableProps {
    playlistId?: string
    tracks: {id: string, version: string | null, name: string, groups: {id: string, name: string}[], authors: {id: string, name: string}[], duration?: number | null}[]
}