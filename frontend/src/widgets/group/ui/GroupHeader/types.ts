export interface GroupHeaderProps {
    id: string
    name: string
    imageURL: string
    description: string
    participants: {id: string, imageURL: string, name: string}[]
}