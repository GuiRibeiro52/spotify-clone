import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";
import Carousel from "../components/Carousel";

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
  uri: string;
}

interface Album {
  id: string;
  name: string;
  images?: { url: string }[];
  artists: { name: string }[];
  release_date: string;
}

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
  description: string;
  owner: { id: string; display_name: string };
}

interface Podcast {
  id: string;
  name: string;
  images?: { url: string }[];
  publisher: string;
}

interface SearchResultsData {
  artists?: { items: Artist[] };
  tracks?: { items: Track[] };
  albums?: { items: Album[] };
  playlists?: { items: Playlist[] };
  shows?: { items: Podcast[] };
}

interface Image {
  url: string;
  width?: number;
  height?: number;
}

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState<SearchResultsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("spotify_access_token");
  const navigate = useNavigate();
  const { setCurrentTrackUri } = usePlayer();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || !token) return;

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<SearchResultsData>(
          "https://api.spotify.com/v1/search",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { q: query, type: "artist,track,album,playlist,show" },
          }
        );
        setResults(response.data);
      } catch (err) {
        console.error("Erro ao buscar resultados:", err);
        setError("Erro ao buscar dados. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, token]);

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
    <div className="bg-[#090707] min-h-screen md:pl-[250px] pt-8 text-white font-rubik pb-16">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Resultados da Pesquisa: "{searchTerm}"</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar novamente..."
            className="w-full p-3 rounded-lg text-white bg-[#121212] focus:outline-none mb-8"
          />
        </form>

        {loading && <p>🔎 Buscando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && results && (
          <div>
            {results.artists && (
              <div className="mb-10">
                <h2 className="text-4xl font-semibold mb-3">ARTISTAS</h2>
                <Carousel
                  items={results.artists.items}
                  renderItem={(artist) => (
                    <div
                      key={artist.id}
                      onClick={() => navigate(`/artistas/${artist.id}/details`)}
                      className="flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#1A1A1A] p-3 rounded-lg h-full w-full sm:w-56"
                    >
                      <img
                        src={artist.images?.[0]?.url || "https://via.placeholder.com/300"}
                        alt={artist.name}
                        className="rounded-full object-cover"
                      />
                      <p className="font-semibold mt-6">{artist.name}</p>
                      <p className="text-sm opacity-80">Artista</p>
                    </div>
                  )}
                />
              </div>
            )}
            {results.albums && (
              <div className="mb-10">
                <h2 className="text-4xl font-semibold mb-3">ÁLBUNS</h2>
                <Carousel
                  items={results.albums.items}
                  renderItem={(album) => (
                    <div
                      key={album.id}
                      onClick={() => navigate(`/album/${album.id}`)}
                      className="flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#1A1A1A] p-3 rounded-lg h-full w-full sm:w-56"
                    >
                      <img
                        src={album.images?.[0]?.url || "https://via.placeholder.com/300"}
                        alt={album.name}
                        className="rounded-lg object-cover"
                      />
                      <p className="font-semibold">{album.name}</p>
                      <p className="text-sm opacity-80">{album.artists.map((artist) => artist.name).join(", ")} • {album.release_date.split("-")[0]}</p>
                    </div>
                  )}
                />
              </div>
            )}
            {results.tracks && (
              <div className="mb-10">
                <h2 className="text-4xl font-semibold mb-3">MÚSICAS</h2>
                <Carousel
                  items={results.tracks.items}
                  settings={{
                    rows: 3,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    responsive: [
                      { breakpoint: 1024, settings: { slidesToShow: 3 } },
                      { breakpoint: 768, settings: { slidesToShow: 2 } },
                      { breakpoint: 480, settings: { slidesToShow: 1 } },
                    ],
                  }}
                  renderItem={(track) => (
                    <div
                      key={track.id}
                      className="flex gap-3 cursor-pointer hover:bg-[#1A1A1A] p-3 rounded-lg"
                      onClick={() => handlePlayTrack(track.uri)}
                    >
                      <img
                        src={getImageUrl(track.album?.images)}
                        alt={track.name}
                        className="w-20 h-20 rounded-lg"
                      />
                      <div className="flex flex-col justify-evenly">
                        <p>{track.name}</p>
                        <p className="text-xs opacity-80">{track.artists.map((artist) => artist.name).join(", ")}</p>
                      </div>
                    </div>
                  )}
                />
              </div>
            )}
            {results.shows && (
              <div className="mb-10">
                <h2 className="text-4xl font-semibold mb-3">PODCASTS</h2>
                <Carousel
                  items={results.shows.items}
                  renderItem={(show) => (
                    <div
                      key={show.id}
                      onClick={() => navigate(`/podcasts/${show.id}`)}
                      className="flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#1A1A1A] p-3 rounded-lg h-full w-full sm:w-56"
                    >
                      <img
                        src={show.images?.[0]?.url || "https://via.placeholder.com/300"}
                        alt={show.name}
                        className="rounded-lg object-cover"
                      />
                      <p className="mt-6">{show.name}</p>
                      <p className="text-sm opacity-80">{show.publisher}</p>
                    </div>
                  )}
                />
              </div>
            )}
            {results.playlists &&
              Array.isArray(results.playlists.items) &&
              results.playlists.items.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-4xl font-semibold mb-3">PLAYLISTS</h2>
                  <Carousel
                    items={results.playlists.items}
                    renderItem={(playlist) => {
                      const playlistImage =
                        playlist &&
                        Array.isArray(playlist.images) &&
                        playlist.images.length > 0
                          ? playlist.images[0].url
                          : "https://via.placeholder.com/300";
                      return (
                        playlist && (
                          <div
                            key={playlist.id}
                            onClick={() => navigate(`/playlists/${playlist.id}`)}
                            className="flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#1A1A1A] p-3 rounded-lg h-full w-full sm:w-56"
                          >
                            <img
                              src={playlistImage}
                              alt={playlist.name || "Playlist"}
                              className="rounded-lg object-cover"
                            />
                            <p className="font-semibold">{playlist.name || "Sem nome"}</p>
                            <p className="text-sm opacity-80">De {playlist.owner.display_name || "Sem nome"}</p>
                          </div>
                        )
                      );
                    }}
                  />
                </div>
              )}         
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;