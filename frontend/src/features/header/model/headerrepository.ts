import type { IHeaderRepository } from "./iheaderrepository";

export class HeaderRepository implements IHeaderRepository {
    sidebarOpen: boolean

    constructor() {
        this.sidebarOpen = false;
    }

    setSidebarOpen(value: boolean) {
        this.sidebarOpen = value;
    }

    getSidebarOpen() {
        return this.sidebarOpen;
    }
}