import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import arrow from "../assets/images/arrow-left.png";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  duration_ms: number;
  album: { images: { url: string }[] };
}

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
  description: string;
}

const PlaylistDetails = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tracks, setTracks] = useState<Track[]>([]);
  const navigate = useNavigate();

  const tracksPerPage = 50;

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      const token = localStorage.getItem("spotify_access_token");

      if (!token || !playlistId) {
        console.error("Token ou ID da playlist não encontrado.");
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
        await fetchAllTracks(response.data.tracks.total, token);
      } catch (error) {
        console.error("Erro ao buscar detalhes da playlist:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllTracks = async (totalTracks: number, token: string) => {
      const limit = 100;
      let allTracks: Track[] = [];

      for (let offset = 0; offset < totalTracks; offset += limit) {
        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const fetchedTracks = response.data.items.map(
          (item: { track: Track }) => item.track,
        );

        allTracks = [...allTracks, ...fetchedTracks];
      }

      setTracks(allTracks);
    };

    fetchPlaylistDetails();
  }, [playlistId]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const indexOfLastTrack = currentPage * tracksPerPage;
  const indexOfFirstTrack = indexOfLastTrack - tracksPerPage;
  const currentTracks = tracks.slice(indexOfFirstTrack, indexOfLastTrack);

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
    <div className="bg-[#121212] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik">
      <div
        className="p-8"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0.8), #121212), url(${playlist.images[0]?.url}) no-repeat center/cover`,
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
            src={playlist.images[0]?.url || "https://via.placeholder.com/200"}
            alt={playlist.name}
            className="w-52 h-52 shadow-lg rounded-lg"
          />

          <div>
            <p className="uppercase text-sm font-semibold">Playlist</p>
            <h1 className="text-xl sm:text-6xl font-extrabold mt-2">
              {playlist.name}
            </h1>
            <p className="mt-2 text-sm text-[#B3B3B3]">
              {playlist.tracks.total} músicas
            </p>
          </div>
        </div>

        <button className="mt-6 bg-primary text-black font-bold px-8 py-3 rounded-full hover:bg-[#1ed760] transition duration-300">
          Play
        </button>
      </div>

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
            {currentTracks.map((track, index) => (
              <tr
                key={track.id}
                className="hover:bg-[#1A1A1A] transition duration-300 cursor-pointer"
              >
                <td className="py-2 px-4">
                  {index + 1 + (currentPage - 1) * tracksPerPage}
                </td>
                <td className="py-2 px-4"><p>{track.name}</p><span className="text-sm text-[#B3B3B3]">{track.artists.map((artist) => artist.name).join(", ")}</span></td>
                <td className="py-2 px-4 hidden sm:contents">
                  {formatDuration(track.duration_ms)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tracks.length > tracksPerPage && (
          <div className="flex justify-center mt-10 gap-3">
            {Array.from(
              { length: Math.ceil(tracks.length / tracksPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === i + 1
                      ? "bg-primary text-black font-bold"
                      : "bg-[#1A1A1A] text-white font-bold hover:bg-[#333]"
                  }`}
                >
                  {i + 1}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetails;