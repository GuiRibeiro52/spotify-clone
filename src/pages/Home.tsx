import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

interface Artist {
  id: string;
  name: string;
  images?: { url: string }[];
}

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
  description: string;
  owner: { id: string; display_name: string };
}

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [topPlaylists, setTopPlaylists] = useState<Playlist[]>([]);
  const [favoriteArtists, setFavoriteArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("spotify_access_token");

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const topPlaylistsResponse = await axios.get(
        "https://api.spotify.com/v1/browse/featured-playlists",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const favoriteArtistsResponse = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTopPlaylists(topPlaylistsResponse.data.playlists.items || []);
      setFavoriteArtists(favoriteArtistsResponse.data.items || []);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Erro ao carregar os dados. Por favor, tente novamente.");
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

  return (
    <div className="bg-[#090707] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik pb-16">
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
              <h2 className="text-2xl font-semibold mb-3">Playlists em alta</h2>
              <Slider {...sliderSettings}>
                {topPlaylists.map((playlist) => (
                  <div key={playlist.id} className="p-2">
                    <img
                      src={playlist.images[0]?.url || "https://via.placeholder.com/300"}
                      alt={playlist.name}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                    <p className="text-center text-sm mt-2">{playlist.name}</p>
                  </div>
                ))}
              </Slider>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3">Seus artistas favoritos</h2>
              <Slider {...sliderSettings}>
                {favoriteArtists.map((artist) => (
                  <div
                    key={artist.id}
                    className="p-2 cursor-pointer"
                    onClick={() => navigate(`/artistas/${artist.id}`)}
                  >
                    <img
                      src={artist.images?.[0]?.url || "https://via.placeholder.com/300"}
                      alt={artist.name}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                    <p className="text-center text-sm mt-2">{artist.name}</p>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;