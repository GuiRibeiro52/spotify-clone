import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import arrow from "../assets/images/arrow-left.png";
import plus from "../assets/images/plus-circle.png";
import trash from "../assets/images/trash.png";
import { usePlayer } from "../context/PlayerContext";

interface Track {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  duration_ms: number;
  album: { images: { url: string }[] };
  uri: string;
}

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
  description: string;
  owner: { id: string, display_name: string; };
}

const PlaylistDetails = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tracks, setTracks] = useState<Track[] | null>(null);
  const [isPlaylistInLibrary, setIsPlaylistInLibrary] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const { setCurrentTrackUri, token } = usePlayer();
  const navigate = useNavigate();
  const tracksPerPage = 50;

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
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
        await checkIfPlaylistInLibrary(token);
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

      setTracks(allTracks.length > 0 ? allTracks : null);
    };

    const checkIfPlaylistInLibrary = async (token: string) => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/me/playlists`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const isSaved = response.data.items.some(
          (item: Playlist) => item.id === playlistId
        );
        setIsPlaylistInLibrary(isSaved);
      } catch (error) {
        console.error("Erro ao verificar se a playlist está na biblioteca:", error);
      }
    };

    fetchPlaylistDetails();
  }, [playlistId, token]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  const handleToggleLibrary = async () => {
    if (!token || !playlistId) return;

    try {
      if (isPlaylistInLibrary) {
        await axios.delete(
          `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsPlaylistInLibrary(false);
      } else {
        await axios.put(
          `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsPlaylistInLibrary(true);
      }
    } catch (error) {
      console.error("Erro ao adicionar/remover a playlist da biblioteca:", error);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!token || !playlistId) return;

    try {
      await axios.delete(
        `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (playlist?.owner.id === playlistId) {
        navigate("/playlists");
      } else {
        setIsPlaylistInLibrary(false);
      }
    } catch (error) {
      console.error("Erro ao remover a playlist:", error);
    } finally {
      setShowModal(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const indexOfLastTrack = currentPage * tracksPerPage;
  const indexOfFirstTrack = indexOfLastTrack - tracksPerPage;
  const currentTracks = tracks ? tracks.slice(indexOfFirstTrack, indexOfLastTrack) : [];

  const playlistImage = playlist?.images?.[0]?.url || "https://via.placeholder.com/200";

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
    <div className="bg-[#121212] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik pb-16">
      <div
        className="p-8"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0.8), #121212), url(${playlistImage}) no-repeat center/cover`,
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
            src={playlistImage}
            alt={playlist.name}
            className="w-52 h-52 shadow-lg rounded-lg"
          />

          <div>
            <p className="uppercase text-sm font-semibold">Playlist</p>
            <h1 className="text-xl sm:text-6xl font-extrabold mt-2">
              {playlist.name}
            </h1>
            <p className="mt-2 text-sm text-[#B3B3B3]">
              AUTOR: {playlist.owner.display_name}
            </p>
            <p className="mt-2 text-sm text-[#B3B3B3]">
              {playlist.tracks.total} músicas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            className="bg-primary text-black font-bold px-8 py-3 rounded-full hover:bg-[#1ed760] transition duration-300"
            onClick={() => setCurrentTrackUri(tracks ? tracks.map((track) => track.uri) : [])}
          >
            Play
          </button>
          <button
            onClick={() => {
              if (isPlaylistInLibrary) {
                setShowModal(true);
              } else {
                handleToggleLibrary();
              }
            }}
            className="px-8 py-3 space-x-3 flex items-center border border-[#333] rounded-full hover:bg-[#333] transition duration-300"
          >
            <img
              src={isPlaylistInLibrary ? trash : plus}
              alt="Library Action"
              className="w-8 h-8"
            />
            {isPlaylistInLibrary ? (
              <p className="text-bold text-sm opacity-80">Remover Playlist</p>
            ) : (
              <p className="text-bold text-sm opacity-80">Adicionar à biblioteca</p>
            )}
          </button>
        </div>
      </div>

      <div className="p-8">
        {tracks === null ? (
          <p className="text-center text-[#B3B3B3] mt-4">Nenhuma música encontrada na playlist.</p>
        ) : (
          <>
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
                    onClick={() => setCurrentTrackUri([track.uri])}
                  >
                    <td className="py-2 px-4">
                      {index + 1 + (currentPage - 1) * tracksPerPage}
                    </td>
                    <td className="py-2 px-4">
                      <p className="text-sm">{track.name}</p>
                      <div className="flex gap-1">
                        {track.artists.map((artist) => (
                          <span
                            key={artist.id}
                            className="text-xs opacity-80 hover:underline hover:text-white cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation(); 
                              navigate(`/artistas/${artist.id}/details`);
                            }}
                          >
                            {artist.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-4 hidden sm:contents text-sm">
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
          </>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-[#303030] p-6 rounded-[32px] text-center space-y-10">
            <p className="text-white font-bold mb-4">Tem certeza que deseja excluir esta playlist?</p>
            <div className="flex justify-center space-x-4 font-bold">
              <button
                onClick={handleDeletePlaylist}
                className="bg-primary text-black px-4 py-2 rounded-lg hover:bg-[#1ed760]"
              >
                Sim
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-[#121212] text-white px-4 py-2 rounded-lg hover:bg-black"
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetails;