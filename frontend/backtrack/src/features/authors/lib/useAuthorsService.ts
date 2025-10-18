import { useContext } from "react"
import { AuthorsContext } from "./authorsContext"

export const useAuthorsService = () => {
    const service = useContext(AuthorsContext);

    return {service}
}