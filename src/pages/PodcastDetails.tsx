import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import arrow from "../assets/images/arrow-left.png";

interface Episode {
  id: string;
  name: string;
  description: string;
  duration_ms: number;
  release_date: string;
  audio_preview_url: string | null;
}

interface Podcast {
  id: string;
  name: string;
  description: string;
  publisher: string;
  images: { url: string }[];
  episodes: { items: Episode[] };
}

const PodcastDetails = () => {
  const { podcastId } = useParams<{ podcastId: string }>();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("spotify_access_token");

  useEffect(() => {
    const fetchPodcastDetails = async () => {
      if (!token || !podcastId) return;

      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/shows/${podcastId}?market=BR`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPodcast(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do podcast:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcastDetails();
  }, [podcastId, token]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#121212] font-bold font-rubik text-lg">
        <h2>Carregando podcast...</h2>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik">
      {podcast && (
        <div
          className="p-8"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0.8), #121212), url(${podcast.images[0]?.url}) no-repeat center/cover`,
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
              src={podcast.images[0]?.url || "https://via.placeholder.com/200"}
              alt={podcast.name}
              className="w-52 h-52 shadow-lg rounded-lg"
            />

            <div>
              <p className="uppercase text-sm font-semibold">Podcast</p>
              <h1 className="text-xl sm:text-5xl font-extrabold mt-2">
                {podcast.name}
              </h1>
              <p className="mt-2 text-sm text-[#B3B3B3]">
                {podcast.publisher} • {podcast.episodes.items.length} episódios
              </p>
              <p className="mt-2 text-sm text-[#B3B3B3]">
                {podcast.description}
              </p>
            </div>
          </div>

          <button className="mt-6 bg-primary text-black font-bold px-8 py-3 rounded-full hover:bg-[#1ed760] transition duration-300">
            Play
          </button>
        </div>
      )}

      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Episódios</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Título</th>
              <th className="py-2 px-4 hidden sm:contents">Duração</th>
              <th className="py-2 px-4 hidden sm:contents">Data de Lançamento</th>
            </tr>
          </thead>
          <tbody>
            {podcast?.episodes.items.map((episode, index) => (
              <tr
                key={episode.id}
                className="hover:bg-[#1A1A1A] transition duration-300 cursor-pointer"
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  <p>{episode.name}</p>
                  <span className="text-sm text-[#B3B3B3]">{episode.description.slice(0, 50)}...</span>
                </td>
                <td className="py-2 px-4 hidden sm:contents">
                  {formatDuration(episode.duration_ms)}
                </td>
                <td className="py-2 px-4 hidden sm:contents">
                  {new Date(episode.release_date).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PodcastDetails;