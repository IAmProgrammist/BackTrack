import { Header } from "widgets/header/ui/Header"
import { ContextProvider } from "../providers/ContextProvider"
import { HomePage } from "pages/home/ui/HomePage/HomePage"

function App() {
  return <ContextProvider>
    <Header/>
    <HomePage/>
  </ContextProvider>
}

export default App
