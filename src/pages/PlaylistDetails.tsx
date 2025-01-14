import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import arrow from "../assets/images/arrow-left.png";

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
  tracks: { total: number };
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
    <div className="bg-[#090707] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik p-8">
      <div className="p-8">
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-lg flex items-center gap-2"
          >
            <img src={arrow} alt="voltar" />
            <p className="font-bold">{playlist?.name}</p>
          </button>
          {playlist?.images[0]?.url && (
            <img
              src={playlist.images[0].url}
              alt={playlist.name}
              className="w-16 h-16 rounded-full mr-10"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 space-y-4">
          {currentTracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-4 cursor-pointer hover:bg-[#1A1A1A] p-2 rounded-lg transition"
            >
              <img
                src={
                  track.album.images.length > 0
                    ? track.album.images[0].url
                    : "https://via.placeholder.com/150"
                }
                alt={track.name}
                className="w-20 h-20"
              />
              <div>
                <h2 className="text-sm font-semibold">{track.name}</h2>
                <p className="text-xs text-[#B3B3B3]">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>

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
