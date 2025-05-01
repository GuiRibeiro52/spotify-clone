/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

interface PlayerContextProps {
  currentTrackUri: string[];
  setCurrentTrackUri: (uris: string[]) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrackUri, setCurrentTrackUri] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem("spotify_access_token"));

  return (
    <PlayerContext.Provider value={{ currentTrackUri, setCurrentTrackUri, token, setToken }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextProps => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer deve ser usado dentro de um PlayerProvider");
  }
  return context;
};