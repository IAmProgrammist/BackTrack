import React from "react";
import type { IHeaderService } from "../model/iheaderservice";

export const HeaderContext = React.createContext<IHeaderService>({} as IHeaderService);