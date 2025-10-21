export interface IHeaderRepository {
    getSidebarOpen: () => boolean
    setSidebarOpen: (value: boolean) => void
}