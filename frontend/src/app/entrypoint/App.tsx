import { Router } from "app/router/Router"
import { ContextProvider } from "../providers/ContextProvider"

function App() {
  return <ContextProvider>
    <Router/>
  </ContextProvider>
}

export default App
