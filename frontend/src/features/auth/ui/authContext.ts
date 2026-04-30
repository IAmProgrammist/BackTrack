import React from "react";
import type { IAuthService } from "../model/iauthservice";

export const AuthContext = React.createContext<IAuthService>({} as IAuthService);