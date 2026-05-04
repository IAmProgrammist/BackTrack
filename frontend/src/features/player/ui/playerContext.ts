import React from "react";
import type { IPlayerService } from "../model/iplayerservice";

export const PlayerContext = React.createContext<IPlayerService>({} as IPlayerService);