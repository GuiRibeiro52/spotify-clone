import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Podcast {
  id: string;
  name: string;
  images?: { url: string }[];
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

  const fetchRecentPodcasts = async () => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/shows", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 10,
        },
      });

      setRecentPodcasts(response.data.items.map((item: any) => item.show));
    } catch (err) {
      console.error("Erro ao buscar podcasts recentes:", err);
      setError("Erro ao buscar podcasts recentes.");
    }
  };

  const fetchTrendingPodcasts = async () => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: "podcast",
          type: "show",
          limit: 10,
        },
      });

      setTrendingPodcasts(response.data.shows.items);
    } catch (err) {
      console.error("Erro ao buscar podcasts em alta:", err);
      setError("Erro ao buscar podcasts em alta.");
    }
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([fetchRecentPodcasts(), fetchTrendingPodcasts()])
        .catch(() => setError("Erro ao carregar dados."))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const getImageUrl = (images?: { url: string }[]) =>
    images && images.length > 0 ? images[0].url : "https://via.placeholder.com/150";

  return (
    <div className="bg-[#090707] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Podcasts</h1>

        {loading && <p className="font-bold">🔎 Carregando podcasts...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {recentPodcasts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-3">🎧 Recentes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentPodcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  onClick={() => navigate(`/podcast/${podcast.id}`)}
                  className="cursor-pointer hover:bg-[#1A1A1A] p-3 rounded-lg"
                >
                  <img
                    src={getImageUrl(podcast.images)}
                    alt={podcast.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <p className="font-semibold">{podcast.name}</p>
                  <p className="text-sm text-gray-400">{podcast.publisher}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {trendingPodcasts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-3">🔥 Em Alta</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trendingPodcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  onClick={() => navigate(`/podcasts/${podcast.id}`)}
                  className="cursor-pointer hover:bg-[#1A1A1A] p-3 rounded-lg"
                >
                  <img
                    src={getImageUrl(podcast.images)}
                    alt={podcast.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <p className="font-semibold">{podcast.name}</p>
                  <p className="text-sm text-gray-400">{podcast.publisher}</p>
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