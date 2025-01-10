import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface UserProfile {
  display_name: string;
  images: { url: string }[];
}

const Profile = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("spotify_access_token");

  const handleLogout = useCallback(() => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Erro ao buscar o perfil do usuário:", error);
        handleLogout();
      }
    };

    fetchUserProfile();
  }, [token, navigate, handleLogout]);

  if (!userData) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#090707] text-white">
        <h1>Carregando...</h1>
      </div>
    );
  }

  return (
    <div className="bg-[#090707] min-h-screen flex justify-center items-center pl-[250px]">
      <div className="flex flex-col items-center text-center font-rubik">
        <img
          src={userData.images?.[0]?.url || "https://via.placeholder.com/150"}
          alt={userData.display_name || "Usuário"}
          className="w-32 h-32 rounded-full mb-6"
        />
        <h1 className="text-2xl text-white font-semibold mb-4">
          {userData.display_name || "Usuário Desconhecido"}
        </h1>
        <button
          onClick={handleLogout}
          className="font-bold w-[113px] h-[42px] rounded-3xl bg-primary  hover:bg-[#1ed760] transition duration-500"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default Profile;
