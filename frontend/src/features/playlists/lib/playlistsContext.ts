import React from "react";
import type { IPlaylistService } from "../model/iplaylistservice";

export const PlaylistsContext = React.createContext<IPlaylistService>({} as IPlaylistService);