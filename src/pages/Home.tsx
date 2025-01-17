import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Artist {
  id: string;
  name: string;
  images?: { url: string }[];
}

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album?: { images?: { url: string }[] };
}

interface Album {
  id: string;
  name: string;
  images?: { url: string }[];
  artists: { name: string }[];
}

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("spotify_access_token");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchTerm,
          type: "artist,track,playlist,album",
          limit: 10,
        },
      });

      console.log("Resposta da API:", response.data);

      setArtists(response.data.artists?.items || []);
      setTracks(response.data.tracks?.items || []);
      setAlbums(response.data.albums?.items || []);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setError("Sessão expirada. Faça login novamente.");
        localStorage.removeItem("spotify_access_token");
        navigate("/login");
      } else {
        setError("Erro ao buscar dados. Tente novamente.");
      }
      console.error("Erro detalhado:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm]);

  const getImageUrl = (images?: { url: string }[]) => {
    return images && images.length > 0 ? images[0].url : "https://via.placeholder.com/150";
  };

  return (
    <div className="bg-[#090707] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">O que vamos ouvir?</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar artistas, músicas, playlists ou álbuns..."
          className="w-full p-3 rounded-lg text-white bg-[#121212] focus:outline-none mb-8"
        />

        {loading && <p>🔎 Buscando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="space-y-8">
            {artists.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-3">Artistas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {artists.map((artist) => (
                    <div
                      key={artist.id}
                      onClick={() => navigate(`/artistas/${artist.id}`)}
                      className="cursor-pointer hover:bg-[#1A1A1A] p-3 rounded-lg"
                    >
                      <img
                        src={getImageUrl(artist.images)}
                        alt={artist.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <p>{artist.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tracks.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-3">Músicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 hover:bg-[#1A1A1A] p-3 rounded-lg"
                    >
                      <img
                        src={getImageUrl(track.album?.images)}
                        alt={track.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p>{track.name}</p>
                        <p className="text-sm text-gray-400">
                          {track.artists.map((artist) => artist.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {albums.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-3">Álbuns</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {albums.map((album) => (
                    <div
                      key={album.id}
                      onClick={() => navigate(`/album/${album.id}`)}
                      className="cursor-pointer hover:bg-[#1A1A1A] p-3 rounded-lg"
                    >
                      <img
                        src={getImageUrl(album.images)}
                        alt={album.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <p>{album.name}</p>
                    </div>
                  ))}
                </div>
              </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default Home;