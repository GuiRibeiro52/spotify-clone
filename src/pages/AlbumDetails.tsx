import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import arrow from "../assets/images/arrow-left.png";
import { usePlayer } from "../context/PlayerContext";

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  preview_url: string | null;
  track_number: number;
  uri: string;
}

interface Artist {
  name: string;
  id: string;
}

interface Album {
  id: string;
  name: string;
  release_date: string;
  images: { url: string }[];
  artists: Artist[];
  tracks: { items: Track[] };
}

const AlbumDetails = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { token, setCurrentTrackUri } = usePlayer();

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      if (!token || !albumId) return;

      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/albums/${albumId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setAlbum(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do álbum:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [albumId, token]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayAll = () => {
    if (album) {
      setCurrentTrackUri(album.tracks.items.map((track) => track.uri));
    }
  };

  const handlePlayTrack = (trackUri: string) => {
    setCurrentTrackUri([trackUri]);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#121212] font-bold font-rubik text-lg">
        <h2>Carregando álbum...</h2>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik pb-16">
      {album && (
        <div
          className="p-8"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0.8), #121212), url(${album.images[0]?.url}) no-repeat center/cover`,
            borderBottom: "1px solid #333",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="text-white text-lg flex items-center gap-2 mb-6"
          >
            <img src={arrow} alt="Voltar" />
            <p className="font-bold">Voltar</p>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={album.images[0]?.url || "https://via.placeholder.com/200"}
              alt={album.name}
              className="w-52 h-52 shadow-lg rounded-lg"
            />

            <div>
              <p className="uppercase text-sm font-semibold">Álbum</p>
              <h1 className="text-xl sm:text-6xl font-extrabold mt-2">
                {album.name}
              </h1>
              <p className="mt-2 text-sm text-[#B3B3B3]">
                {album.artists.map((artist) => artist.name).join(", ")} •{" "}
                {album.release_date.split("-")[0]} • {album.tracks.items.length}{" "}
                músicas
              </p>
            </div>
          </div>

          <button
            className="mt-6 bg-primary text-black font-bold px-8 py-3 rounded-full hover:bg-[#1ed760] transition duration-300"
            onClick={handlePlayAll}
          >
            Play
          </button>
        </div>
      )}

      <div className="p-8">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Título</th>
              <th className="py-2 px-4 hidden sm:contents">Duração</th>
            </tr>
          </thead>
          <tbody>
            {album?.tracks.items.map((track) => (
              <tr
                key={track.id}
                className="hover:bg-[#1A1A1A] transition duration-300 cursor-pointer"
                onClick={() => handlePlayTrack(track.uri)}
              >
                <td className="py-2 px-4">{track.track_number}</td>
                <td className="py-2 px-4">
                  <p className="text-sm">{track.name}</p>
                  <span className="text-xs opacity-80">
                    {album.artists.map((artist) => artist.name).join(", ")}
                  </span>
                </td>
                <td className="py-2 px-4 hidden sm:contents text-sm">
                  {formatDuration(track.duration_ms)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlbumDetails;
