import type { EventListener } from "shared/model/eventHandler"


export type HeaderServiceEvents = {
    'sidebar:changed': { opened: boolean }
}

export interface IHeaderService extends EventListener<HeaderServiceEvents> {
    getSidebarOpen: () => boolean
    setSidebarOpen: (value: boolean) => void
    avatarClicked: () => void
}