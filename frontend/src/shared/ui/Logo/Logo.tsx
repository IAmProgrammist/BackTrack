import clsx from "clsx"
import "./logo.css"
import { Link } from "react-router"

export const Logo = ({size = "large", ...props}) => {
    return <Link {...props} to="/" className={clsx("logo", size === "small" && "logo--small")}/>
}