import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface PodcastImage {
  url: string;
  width?: number;
  height?: number;
}

interface Podcast {
  id: string;
  name: string;
  images?: PodcastImage[];
  publisher: string;
  description: string;
}

const Podcasts = () => {
  const [recentPodcasts, setRecentPodcasts] = useState<Podcast[]>([]);
  const [trendingPodcasts, setTrendingPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("spotify_access_token");
  const navigate = useNavigate();

  const fetchRecentPodcasts = useCallback(async () => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/shows", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: "podcast",
          type: "show",
        },
      });

      setRecentPodcasts(response.data.items.map((item: { show: Podcast }) => item.show));
    } catch (err) {
      console.error("Erro ao buscar podcasts recentes:", err);
      setError("Erro ao buscar podcasts recentes.");
    }
  }, [token]);

  const fetchTrendingPodcasts = useCallback(async () => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: "podcast",
          type: "show",
        },
      });

      setTrendingPodcasts(response.data.shows.items);
    } catch (err) {
      console.error("Erro ao buscar podcasts em alta:", err);
      setError("Erro ao buscar podcasts em alta.");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([fetchRecentPodcasts(), fetchTrendingPodcasts()])
        .catch(() => setError("Erro ao carregar dados."))
        .finally(() => setLoading(false));
    }
  }, [token, fetchRecentPodcasts, fetchTrendingPodcasts]);

  const getImageUrl = (images?: PodcastImage[]) => {
    if (!images || images.length === 0) {
      return "https://via.placeholder.com/216";
    }    
    const highResImage = images.find((image) => image.width === 640);
  
    return highResImage ? highResImage.url : images[1].url;
  };

  useEffect(() => {
    console.log("Recent Podcasts:", recentPodcasts);
    console.log("Trending Podcasts:", trendingPodcasts);
  }, [recentPodcasts, trendingPodcasts]);

  return (
    <div className="bg-[#090707] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Podcasts</h1>

        {loading && <p className="font-bold">🔎 Carregando podcasts...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {recentPodcasts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">🎧 Ouvido Recentemente</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {recentPodcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  onClick={() => navigate(`/podcasts/${podcast.id}`)}
                  className="flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:bg-[#1A1A1A] p-3 rounded-lg h-full w-full sm:w-56"
                >
                  <img
                    src={getImageUrl(podcast.images)}
                    alt={podcast.name}
                    className="object-cover rounded-lg"
                  />
                  <p className="text-sm font-semibold">{podcast.name}</p>
                  <p className="text-xs opacity-80">{podcast.publisher}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {trendingPodcasts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-3">🔥 Em Alta</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {trendingPodcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  onClick={() => navigate(`/podcasts/${podcast.id}`)}
                  className="flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:bg-[#1A1A1A] p-3 rounded-lg h-full w-full sm:w-56"
                >
                  <img
                    src={getImageUrl(podcast.images)}
                    alt={podcast.name}
                    className="object-cover rounded-lg"
                  />
                  <p className="font-semibold text-sm">{podcast.name}</p>
                  <p className="opacity-80 text-xs">{podcast.publisher}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Podcasts;