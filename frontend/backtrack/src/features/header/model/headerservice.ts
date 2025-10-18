import { EventListener } from "../../../shared/model/eventHandler";
import type { IHeaderRepository } from "./iheaderrepository";
import type { HeaderServiceEvents, IHeaderService } from "./iheaderservice";

export class HeaderService extends EventListener<HeaderServiceEvents> implements IHeaderService {
    headerRepository: IHeaderRepository
    
    constructor(headerRepository: IHeaderRepository) {
        super();
        this.headerRepository = headerRepository;
    }

    getSidebarOpen() {
        return this.headerRepository.getSidebarOpen();
    }

    setSidebarOpen(value: boolean) {
        console.log(this);
        this.headerRepository.setSidebarOpen(value);
        this.eventHandler("sidebar:changed", {opened: value});
    }

    avatarClicked() {
        alert("Not implemented");
    }
}