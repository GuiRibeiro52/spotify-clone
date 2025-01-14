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
          },
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
          },
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

  return (
    <div className="bg-[#090707] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik">
      <div className="p-8">
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-lg flex items-center gap-2 "
          >
            <img src={arrow} alt="voltar" />
            <p className="font-bold">{artist?.name}</p>
          </button>
          {artist?.images[0]?.url && (
            <img
              src={artist.images[0].url}
              alt={artist.name}
              className="w-16 h-16 rounded-full mr-10"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 space-y-4 ">
          {currentAlbums.map((album) => (
            <div
              key={album.id}
              className="flex items-center gap-4 cursor-pointer hover:bg-[#1A1A1A] p-2 rounded-lg transition"
            >
              <img
                src={album.images[0]?.url || "https://via.placeholder.com/64"}
                alt={album.name}
                className="w-20 h-20"
              />
              <div>
                <h3 className="text-lg font-semibold">{album.name}</h3>
                <p className="text-sm text-[#B3B3B3]">{album.release_date}</p>
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
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Albums;
