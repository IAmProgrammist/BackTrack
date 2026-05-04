import { useContext } from "react";
import { PlayerContext } from "./playerContext";

export const usePlayerContext = () => useContext(PlayerContext);