import { Author } from "../../entities/author/ui/Author"
import { AuthorHeader } from "../../entities/author/ui/AuthorHeader"
import { Group } from "../../entities/group/ui/Group"
import { GroupHeader } from "../../entities/group/ui/GroupHeader"
import { Header } from "../../widgets/header/ui/Header"
import { HeaderContextProvider } from "../providers/HeaderContextProvider"

function App() {
  return <HeaderContextProvider>
    <Header/>
      <Group redirect
      id="1"
      imageURL="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"  
      name="A group"
      />
      <GroupHeader 
        id="1" 
        name="A group" 
        description="GigaGroup! GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!" 
        participants={[{id: "1", imageURL: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png", name: "A group name"}, {id: "1", imageURL: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png", name: "A group name"}, {id: "1", imageURL: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png", name: "A group name"}]} 
        imageURL="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
        />
        <Author redirect
      id="1"
      imageURL="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"  
      name="A group"/>
      <AuthorHeader 
      id="1" 
        name="A group" 
        description="GigaGroup! GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!GigaGroup!" 
        imageURL="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
        />
  </HeaderContextProvider>
}

export default App
