import clsx from "clsx"
import "./logo.css"

export const Logo = ({size = "large", ...props}) => {
    return <a {...props} href="/" className={clsx("logo", size === "small" && "logo--small")}/>
}