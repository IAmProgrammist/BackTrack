import React from "react";
import type { IAuthorService } from "../model/iauthorservice";

export const AuthorsContext = React.createContext<IAuthorService>(null);