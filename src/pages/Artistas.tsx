import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
}

const Artistas = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const token = localStorage.getItem("spotify_access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopArtists = async () => {
      if (!token) {
        console.warn("Token não encontrado. Faça login novamente.");
        return;
      }

      console.log("Token de acesso:", token);

      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/top/artists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              limit: 10,
              time_range: "short_term",
            },
          },
        );

        console.log("Resposta da API:", response.data);
        setArtists(response.data.items);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Erro ao buscar artistas:",
            error.response?.data || error.message,
          );
        } else {
          console.error("Erro inesperado:", error);
        }
      }
    };

    fetchTopArtists();
  }, [token]);

  return (
    <div className="bg-[#090707] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Top Artistas</h1>
        <p className="text-[#D3DADD] mb-6">
          Aqui você encontra seus artistas preferidos
        </p>

        <div className="flex flex-col gap-4">
          {artists.length > 0 ? (
            artists.map((artist) => (
              <div
                key={artist.id}
                className="flex items-center gap-4 cursor-pointer hover:bg-[#1A1A1A] p-2 rounded-lg transition"
                onClick={() => navigate(`/artistas/${artist.id}`)}
              >
                <img
                  src={
                    artist.images[0]?.url || "https://via.placeholder.com/64"
                  }
                  alt={artist.name}
                  className="w-16 h-16 rounded-full"
                />
                <h2 className="text-sm">{artist.name}</h2>
              </div>
            ))
          ) : (
            <p>Nenhum artista encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Artistas;
