import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import spotify from "../assets/images/SpotifyLogo.png";
import home from "../assets/images/home.png";
import homeInativo from "../assets/images/home-inativo.png";
import play from "../assets/images/play.png";
import playInativo from "../assets/images/play-inativo.png";
import disc from "../assets/images/disc.png";
import discInativo from "../assets/images/disc-inativo.png";
import user from "../assets/images/user.png";
import userInativo from "../assets/images/user-inativo.png";

const Sidebar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isArtistasActive = () => location.pathname.startsWith("/artistas");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="w-[250px] h-screen bg-black text-white fixed left-0 top-0 flex-col justify-between font-dm font-bold hidden md:flex">
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
                  src={isArtistasActive() ? disc : discInativo}
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
                  style={{
                    color: isActive("/playlists") ? "#FFFFFF" : "#949EA2",
                  }}
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
                  style={{
                    color: isActive("/profile") ? "#FFFFFF" : "#949EA2",
                  }}
                  className="hover:text-white transition"
                >
                  Perfil
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <nav className="bg-black text-white fixed w-full z-50 flex items-center justify-between px-4 py-3 md:hidden">
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {isMenuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
        </button>

        <img src={spotify} alt="Spotify" className="h-8 mr-4" />
      </nav>

      <div
        className={`fixed inset-0 z-40 flex transition-opacity duration-1000 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={toggleMenu}
          className={`fixed inset-0 bg-black transition-opacity duration-1000 ${
            isMenuOpen ? "bg-opacity-40" : "bg-opacity-0"
          }`}
        ></div>
        <div
          className={`w-[250px] h-screen bg-black text-white p-4 transform transition-transform duration-1000 font-bold ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mt-8">
            <img src={spotify} alt="Spotify" className="w-44 mt-12" />
          </div>
          <nav className="mt-11">
            <ul className="space-y-6 text-[19px]">
              <li onClick={toggleMenu} className="flex items-center space-x-4">
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
              <li onClick={toggleMenu} className="flex items-center space-x-4">
                <img
                  src={isArtistasActive() ? disc : discInativo}
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
              <li onClick={toggleMenu} className="flex items-center space-x-4">
                <img
                  src={isActive("/playlists") ? play : playInativo}
                  alt="playlists"
                  className="w-6"
                />
                <Link
                  to="/playlists"
                  style={{
                    color: isActive("/playlists") ? "#FFFFFF" : "#949EA2",
                  }}
                  className="hover:text-white transition"
                >
                  Playlists
                </Link>
              </li>
              <li onClick={toggleMenu} className="flex items-center space-x-4">
                <img
                  src={isActive("/profile") ? user : userInativo}
                  alt="perfil"
                  className="w-6"
                />
                <Link
                  to="/profile"
                  style={{
                    color: isActive("/profile") ? "#FFFFFF" : "#949EA2",
                  }}
                  className="hover:text-white transition"
                >
                  Perfil
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
