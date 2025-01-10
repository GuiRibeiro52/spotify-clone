import { Link, useLocation } from "react-router-dom";
import spotify from "../assets/images/SpotifyLogo.png";
import home from "../assets/images/home.png";
import homeInativo from "../assets/images/home-inativo.png";
import play from "../assets/images/play.png";
import playInativo from "../assets/images/play-inativo.png";
import disc from "../assets/images/disc.png";
import discInavito from "../assets/images/disc-inativo.png";
import user from "../assets/images/user.png";
import userInativo from "../assets/images/user-inativo.png";

const Sidebar = () => {
  const location = useLocation(); 

  
  const isActive = (path: string) => location.pathname === path;
  const isArtistasActive = () => location.pathname.startsWith("/artistas");

  return (
    <div className="w-[250px] h-screen bg-black text-white fixed left-0 top-0 flex flex-col justify-between font-dm font-bold">
      <div className="p-4">
        <div className="mt-8">
          <img src={spotify} alt="Spotify" className="w-44" />
        </div>
        <nav className="mt-11">
          <ul className="space-y-6 text-[19px]">
            <li className="flex items-center space-x-4">
              <img
                src={isActive("/") ? home : homeInativo}
                alt="home"
                className="w-6"
              />
              <Link
                to="/"
                style={{ color: isActive("/") ? "#FFFFFF" : "#949EA2" }}
                className="hover:text-white transition"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center space-x-4">
              <img
                src={isArtistasActive() ? disc : discInavito}
                alt="artistas"
                className="w-6"
              />
              <Link
                to="/artistas"
                style={{ color: isArtistasActive() ? "#FFFFFF" : "#949EA2" }}
                className="hover:text-white transition"
              >
                Artistas
              </Link>
            </li>
            <li className="flex items-center space-x-4">
              <img
                src={isActive("/playlists") ? play : playInativo}
                alt="playlists"
                className="w-6"
              />
              <Link
                to="/playlists"
                style={{ color: isActive("/playlists") ? "#FFFFFF" : "#949EA2" }}
                className="hover:text-white transition"
              >
                Playlists
              </Link>
            </li>
            <li className="flex items-center space-x-4">
              <img
                src={isActive("/profile") ? user : userInativo}
                alt="perfil"
                className="w-6"
              />
              <Link
                to="/profile"
                style={{ color: isActive("/profile") ? "#FFFFFF" : "#949EA2" }}
                className="hover:text-white transition"
              >
                Perfil
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;