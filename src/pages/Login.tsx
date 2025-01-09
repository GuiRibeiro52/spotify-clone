import spotify from "../assets/images/SpotifyLogo.png";

const CLIENT_ID = "e91af643cc464215869afe53be7c4cd4";
const REDIRECT_URI = "http://localhost:5173/callback"; 
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private"
];


const LOGIN_URL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(
  SCOPES.join(" ")
)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

const Login = () => {
  const handleLogin = () => {
    window.location.href = LOGIN_URL;
  };

  return (
    <div className="bg-[#090707] h-screen flex flex-col justify-center items-center font-rubik">
      <img src={spotify} alt="Spotify Logo" className="w-44 mb-6" />
      <h2 className="font-semibold text-white text-center mb-6">Entra com sua conta Spotify clicando no botão abaixo</h2>
      <button
        onClick={handleLogin}
        className="font-bold w-[133px] h-[42px] rounded-3xl bg-[#1DB954]  hover:bg-[#1ed760] transition duration-300"
      >
        Entrar
      </button>
    </div>
  );
};

export default Login;