import type { HTMLAttributes, ReactNode } from "react"

export interface TextWithIconProps extends HTMLAttributes<HTMLDivElement> {
    imageURL: string
    title: string
    subContent?: ReactNode
    subSubContent?: ReactNode
}