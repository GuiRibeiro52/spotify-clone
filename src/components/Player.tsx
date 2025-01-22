import React, { useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import axios from "axios";
import shuffleDisabled from "../assets/images/shuffle.png";
import shuffleActive from "../assets/images/shuffleActive.png";
import repeat from "../assets/images/repeat.png";
import repeatall from "../assets/images/repeatActive.png";
import repeatOnce from "../assets/images/repeat-once.png";

interface PlayerProps {
  token: string;
  uris: string[];
}

const Player: React.FC<PlayerProps> = ({ token, uris }) => {
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "track" | "context">("off");

  const toggleShuffle = async () => {
    try {
      if (!token) {
        console.error("Token ausente. Não é possível alterar o estado de shuffle.");
        return;
      }

      await axios.put(
        `https://api.spotify.com/v1/me/player/shuffle?state=${!shuffle}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShuffle(!shuffle);
      console.log("Shuffle atualizado:", !shuffle);
    } catch (error) {
      console.error("Erro ao alternar shuffle:", error);
    }
  };

  const toggleRepeat = async () => {
    const nextRepeatMode =
      repeatMode === "off" ? "context" : repeatMode === "context" ? "track" : "off";
    try {
      if (!token) {
        console.error("Token ausente. Não é possível alterar o estado de repeat.");
        return;
      }

      await axios.put(
        `https://api.spotify.com/v1/me/player/repeat?state=${nextRepeatMode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRepeatMode(nextRepeatMode);
      console.log("Repeat atualizado:", nextRepeatMode);
    } catch (error) {
      console.error("Erro ao alternar repeat:", error);
    }
  };

  return (
    <div className="fixed flex justify-center bottom-0 w-full md:l-[250px] bg-[#181818] py-1 px-2">
      <SpotifyPlayer
        token={token}
        uris={uris}
        showSaveIcon
        play={uris.length > 0}
        styles={{
          bgColor: "#181818",
          color: "#fff",
          sliderColor: "#1DB954",
          trackNameColor: "#fff",
          trackArtistColor: "#ccc",
        }}
      />
      <div className="flex justify-center gap-4 py-2">
        <button
          onClick={toggleShuffle}
          className="px-4 py-2 rounded-full"
        >
          {shuffle ? <img src={shuffleActive} alt="Aleatorio Ativado" /> : <img src={shuffleDisabled} alt="Aleatorio desativado" /> }
        </button>

        <button
          onClick={toggleRepeat}
          className="px-4 py-2 rounded-full"
        >
          {repeatMode === "off"
            ? <img src={repeat} alt="repete desativado" />
            : repeatMode === "context"
            ? <img src={repeatall} alt="Repetir tudo" />
            : <img src={repeatOnce} alt="Repetir uma vez" />}
        </button>
      </div>
    </div>
  );
};

export default Player;