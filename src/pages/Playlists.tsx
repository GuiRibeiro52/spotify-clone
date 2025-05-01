import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Playlist {
  id: string;
  name: string;
  owner: {
    display_name: string;
  };
  images: { url: string }[];
}

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const playlistsPerPage = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem("spotify_access_token");

  const indexOfLastPlaylist = currentPage * playlistsPerPage;
  const indexOfFirstPlaylist = indexOfLastPlaylist - playlistsPerPage;
  const currentPlaylists = playlists.slice(
    indexOfFirstPlaylist,
    indexOfLastPlaylist,
  );

  useEffect(() => {
    const fetchUserId = async () => {
      if (!token) return;

      try {
        const response = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserId(response.data.id);
      } catch (error) {
        console.error("Erro ao buscar ID do usuário:", error);
      }
    };

    fetchUserId();
  }, [token]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setPlaylists(response.data.items);
      } catch (error) {
        console.error("Erro ao buscar playlists:", error);
      }
    };

    fetchPlaylists();
  }, [token]);

  const handleCreatePlaylist = async () => {
    if (!token || !newPlaylistName || !userId) return;

    try {
      const response = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        { name: newPlaylistName, public: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const newPlaylist = response.data;
      setPlaylists((prev) => [newPlaylist, ...prev]);
      setNewPlaylistName("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar playlist:", error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlists/${playlistId}`);
  };

  return (
    <div className="bg-[#090707] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik pb-16">
      <div className="p-8">
        <div className="flex flex-col space-y-8 sm:space-y-0 sm:flex-row sm:justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Minhas Playlists</h1>
            <p className="text-[#D3DADD]">Sua coleção pessoal de playlists</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-black font-bold px-6 py-2 rounded-3xl hover:bg-[#1ed760] transition duration-500 w-[185px] h-[42px]"
          >
            Criar playlist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 space-y-4">
          {currentPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist.id)}
              className="flex items-center gap-4 cursor-pointer hover:bg-[#1A1A1A] p-2 rounded-md transition duration-300"
            >
              <img
                src={
                  Array.isArray(playlist.images) && playlist.images.length > 0
                    ? playlist.images[0].url
                    : "https://via.placeholder.com/64"
                }
                alt={playlist.name}
                className="w-20 h-20 rounded-lg"
              />
              <div>
                <h2 className="text-sm">{playlist.name}</h2>
                <p className="text-xs opacity-80">
                  {playlist.owner.display_name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {playlists.length > playlistsPerPage && (
          <div className="flex justify-center mt-20 gap-3">
            {Array.from(
              { length: Math.ceil(playlists.length / playlistsPerPage) },
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-[#303030] p-6 rounded-[32px] text-center relative w-[90%] max-w-[600px] h-[346px] flex flex-col items-center justify-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-4 text-white text-2xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-sm font-medium mb-4">
              Dê um nome à sua playlist
            </h2>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Minha playlist"
              className="w-[90%] p-2 border-b border-white border-opacity-40 bg-[#303030] text-white focus:outline-none text-center mt-6 mb-16 text-2xl"
            />
            <button
              onClick={handleCreatePlaylist}
              className="bg-primary w-[121px] h-[42px] text-black font-bold px-6 py-2 rounded-3xl hover:bg-[#1ed760] transition duration-300"
            >
              Criar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlists;