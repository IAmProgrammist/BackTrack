import React from "react";
import type { ISongService } from "../model/isongservice";

export const SongsContext = React.createContext<ISongService>({} as ISongService);