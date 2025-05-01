import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import arrow from "../assets/images/arrow-left.png";

interface Album {
  id: string;
  name: string;
  release_date: string;
  images: { url: string }[];
}

interface Artist {
  name: string;
  images: { url: string }[];
}

const Albums = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const albumsPerPage = 10;
  const token = localStorage.getItem("spotify_access_token");
  const navigate = useNavigate();

  const indexOfLastAlbum = currentPage * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbums = albums.slice(indexOfFirstAlbum, indexOfLastAlbum);

  useEffect(() => {
    const fetchArtistAndAlbums = async () => {
      if (!token || !artistId) return;

      try {
        const artistResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setArtist(artistResponse.data);

        const albumsResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}/albums`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              limit: 50,
              include_groups: "album,single",
            },
          }
        );
        setAlbums(albumsResponse.data.items);
      } catch (error) {
        console.error("Erro ao buscar álbuns:", error);
      }
    };

    fetchArtistAndAlbums();
  }, [artistId, token]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAlbumClick = (albumId: string) => {
    navigate(`/album/${albumId}`);
  };

  return (
    <div className="bg-[#121212] min-h-screen md:pl-[250px] text-white font-rubik pb-16">
      {artist && (
        <div
          className="p-8"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0.8), #121212), url(${artist.images[0]?.url}) no-repeat center/cover`,
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
              src={artist.images[0]?.url || "https://via.placeholder.com/200"}
              alt={artist.name}
              className="w-52 h-52 shadow-lg rounded-lg"
            />

            <div>
              <h1 className="text-xl sm:text-6xl font-extrabold mt-2">
                {artist.name}
              </h1>
              <p className="mt-2 text-sm text-[#B3B3B3]">Discografia completa</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 space-y-4">
          {currentAlbums.map((album) => (
            <div
              key={album.id}
              onClick={() => handleAlbumClick(album.id)}
              className="flex items-center gap-4 cursor-pointer hover:bg-[#1A1A1A] p-2 rounded-lg transition"
            >
              <img
                src={album.images[0]?.url || "https://via.placeholder.com/64"}
                alt={album.name}
                className="w-20 h-20 rounded-lg"
              />
              <div>
                <h3 className="text-lg font-semibold">{album.name}</h3>
                <p className="text-xs opacity-80">
                  Lançamento: {album.release_date}
                </p>
              </div>
            </div>
          ))}
        </div>

        {albums.length > albumsPerPage && (
          <div className="flex justify-center mt-10 gap-3">
            {Array.from(
              { length: Math.ceil(albums.length / albumsPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === i + 1
                      ? "bg-primary text-black font-bold"
                      : "bg-[#1A1A1A] text-white font-bold hover:bg-[#333]"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Albums;
