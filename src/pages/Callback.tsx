import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const REDIRECT_URI =
  import.meta.env.MODE === "development"
    ? "http://localhost:5173/callback"
    : "https://spotify-clone-ten-gilt.vercel.app/callback";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        console.error("Código de autorização não encontrado na URL.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(
          TOKEN_URL,
          new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID!,
            client_secret: CLIENT_SECRET!,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );

        const { access_token, refresh_token } = response.data;

        localStorage.setItem("spotify_access_token", access_token);
        localStorage.setItem("spotify_refresh_token", refresh_token);

        navigate("/");
      } catch (error) {
        console.error("Erro ao buscar token:", error);
      }
    };

    fetchToken();
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center font-rubik text-3xl bg-[#090707] text-white">
      <h1>Autenticando...</h1>
    </div>
  );
};

export default Callback;
