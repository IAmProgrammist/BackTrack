export interface SongHeaderProps {
    id: string
    name: string 
    description: string 
    tag?: string
    imageURL?: string
    bpm?: string
    songKey?: string | null
    duration?: number | null
    version: string
}