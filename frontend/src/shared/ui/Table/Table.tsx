import clsx from "clsx";
import type { TableCellProps, TableHeaderCellProps, TableHRProps, TableProps } from "./types";
import "./table.css"

export const Table = ({className, ...props}: TableProps) => {
    return <div {...props} className={clsx("table", className)}/>
}

export const TableHeaderCell = ({className, ...props}: TableHeaderCellProps) => {
    return <div {...props} className={clsx("table-header-cell", className)}/>
}

export const TableCell = ({className, ...props}: TableCellProps) => {
    return <div {...props} className={clsx("table-cell", className)}/>
}

export const TableHR = ({className, ...props}: TableHRProps) => {
    return <div {...props} className={clsx("table-hr", className)}/>
}