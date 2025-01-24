import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Carousel from "../components/Carousel";
import { usePlayer } from "../context/PlayerContext";

interface Artist {
  id: string;
  name: string;
  images?: { url: string }[];
}

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  duration_ms: number;
  album?: {
    id: string; 
    name: string; 
    images?: { url: string }[]; 
  };
  uri: string;
}

interface Image {
  url: string;
  width?: number;
  height?: number;
}

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [favoriteArtists, setFavoriteArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("spotify_access_token");
  const { setCurrentTrackUri } = usePlayer();

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const topTracksResponse = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const favoriteArtistsResponse = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTopTracks(topTracksResponse.data.items || []);
      setFavoriteArtists(favoriteArtistsResponse.data.items || []);
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error?.message
          ? err.response.data.error.message
          : "Erro ao carregar os dados. Por favor, tente novamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?query=${searchTerm}`);
    }
  };

  const getImageUrl = (images?: Image[]) => {
    if (!images || images.length === 0) {
      return "https://via.placeholder.com/216";
    }
    return images[0].url;
  };

  const handlePlayTrack = (trackUri: string) => {
    setCurrentTrackUri([trackUri]);
  };

  return (
    <div className="bg-[#090707] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik pb-24">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">O que vamos ouvir?</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar artistas, músicas, playlists, álbuns ou podcasts..."
            className="w-full p-3 rounded-lg text-white bg-[#121212] focus:outline-none mb-8"
          />
        </form>

        {loading && <p>🔎 Buscando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-3">Suas Top Músicas</h2>
              {topTracks.length > 0 ? (
                <Carousel
                  items={topTracks}
                  settings={{
                    slidesToShow: 6,
                    slidesToScroll: 1,
                    infinite: true,
                  }}
                  renderItem={(track) => (
                    <div
                      className="p-2 cursor-pointer"
                      onClick={() => handlePlayTrack(track.uri)}
                    >
                      <img
                        src={getImageUrl(track.album?.images)}
                        alt={`Capa do álbum de ${track.name}`}
                        className="rounded-lg object-cover w-48 mx-auto"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-center mt-2">{track.name}</p>
                        <span 
                          key={track.album?.images?.[0]?.url}
                          className="text-sm opacity-80 cursor-pointer hover:underline"
                          onClick={(event) => {
                            event.stopPropagation();
                            if (track.album?.id) {
                              navigate(`/album/${track.album.id}`);
                            }
                          }}
                          >
                            {track.album?.name}
                        </span>
                      </div>
                    </div>
                  )}
                />
              ) : (
                <p className="text-center text-gray-500">Nenhuma música encontrada.</p>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3">Seus artistas favoritos</h2>
              {favoriteArtists.length > 0 ? (
                <Carousel
                  items={favoriteArtists}
                  renderItem={(artist) => (
                    <div
                      className="p-2 cursor-pointer max-w-[200px]"
                      onClick={() => navigate(`/artistas/${artist.id}/details`)}
                    >
                      <img
                        src={artist.images?.[0]?.url || "https://via.placeholder.com/300"}
                        alt={`Imagem de ${artist.name}`}
                        className="rounded-full object-cover h-48 w-48 mx-auto"
                      />
                      <p className="text-center text-sm mt-2">{artist.name}</p>
                    </div>
                  )}
                />
              ) : (
                <p className="text-center text-gray-500">Nenhum artista favorito encontrado.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;