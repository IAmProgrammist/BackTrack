import React from "react";
import type { IGroupService } from "../model/igroupservice";

export const GroupsContext = React.createContext<IGroupService>(null);