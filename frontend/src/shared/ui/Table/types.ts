import type { HTMLAttributes } from "react";

export interface TableProps extends HTMLAttributes<HTMLDivElement> {

}

export interface TableHeaderCellProps extends HTMLAttributes<HTMLDivElement> {
    
}

export interface TableCellProps extends HTMLAttributes<HTMLDivElement> {
    
}

export interface TableHRProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    
}