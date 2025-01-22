import React from "react";
import SpotifyPlayer from "react-spotify-web-playback";

interface PlayerProps {
  token: string;
  uris: string[];
}

const Player: React.FC<PlayerProps> = ({ token, uris }) => {
  return (
    <div className="fixed bottom-0 w-full md:pl-[250px]">
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
    </div>
  );
};

export default Player;