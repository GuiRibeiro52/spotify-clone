import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { items: { track: Track }[] };
}

const PlaylistDetails = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      const token = localStorage.getItem("spotify_access_token");

      if (!token) {
        console.error("Token não encontrado.");
        return;
      }

      if (!playlistId) {
        console.error("ID da playlist não encontrado.");
        return;
      }

      try {
        setLoading(true);

        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setPlaylist(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes da playlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [playlistId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#090707] font-bold font-rubik text-lg">
        <h2>Carregando playlist...</h2>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#090707] font-bold font-rubik text-lg">
        <h2>Playlist não encontrada.</h2>
      </div>
    );
  }

  return (
    <div className="bg-[#090707] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik p-8">
      <div className="flex items-center gap-6 mb-8">
        <img
          src={
            playlist.images && playlist.images.length > 0
              ? playlist.images[0].url
              : "https://via.placeholder.com/150"
          }
          alt={playlist.name}
          className="w-32 h-32 rounded-lg"
        />
        <h1 className="text-3xl font-bold">{playlist.name}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {playlist.tracks.items.map(({ track }) => (
          <div key={track.id} className="bg-[#181818] p-4 rounded-lg">
            <img
              src={
                track.album.images.length > 0
                  ? track.album.images[0].url
                  : "https://via.placeholder.com/150"
              }
              alt={track.name}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <h2 className="text-sm font-semibold">{track.name}</h2>
            <p className="text-xs text-gray-400">
              {track.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetails;
