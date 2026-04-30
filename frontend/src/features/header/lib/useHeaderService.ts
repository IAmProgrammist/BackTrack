import { useContext, useEffect, useState } from "react";
import type { HeaderServiceEvents } from "../model/iheaderservice";
import { HeaderContext } from "./headerContext";

export const useHeaderService = () => {
    const context = useContext(HeaderContext);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(context?.getSidebarOpen?.() || false);
    const handleSidebarChange = ({opened}: HeaderServiceEvents["sidebar:changed"]) => {
        setSidebarOpen(opened)
    }

    useEffect(() => {
        context?.addEventListener?.("sidebar:changed", handleSidebarChange);

        return () => {
            context?.removeEventListener?.("sidebar:changed", handleSidebarChange);
        }
    }, [handleSidebarChange])

    return {
        sidebarOpen,
        service: context
    }
}