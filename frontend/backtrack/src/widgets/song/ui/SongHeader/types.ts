export interface SongHeaderProps {
    id: string
    name: string 
    description: string 
    tag?: string
    imageURL?: string
    bpm?: string
    songKey?: string
    duration: number
    version: string
}