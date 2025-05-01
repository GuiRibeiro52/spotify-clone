import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import arrow from "../assets/images/arrow-left.png";
import { usePlayer } from "../context/PlayerContext";
import Carousel from "../components/Carousel";

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  uri: string;
  album: { name: string; images: { url: string }[] };
}

interface Album {
  id: string;
  name: string;
  release_date: string;
  images: { url: string }[];
}

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
}

const ArtistaDetails = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMoreTracks, setShowMoreTracks] = useState(false);
  const { token, setCurrentTrackUri } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtistDetails = async () => {
      if (!token || !artistId) return;

      try {
        setLoading(true);
        const artistResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setArtist(artistResponse.data);

        const tracksResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=BR`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTopTracks(tracksResponse.data.tracks);

        const albumsResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=BR&limit=50`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAlbums(albumsResponse.data.items);

        const relatedResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRelatedArtists(relatedResponse.data.artists);
      } catch (error) {
        console.error("Erro ao buscar dados do artista:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDetails();
  }, [artistId, token]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayTrack = (trackUri: string) => {
    setCurrentTrackUri([trackUri]);
  };

  const handlePlayAll = () => {
    setCurrentTrackUri(topTracks.map((track) => track.uri));
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#121212] font-bold font-rubik text-lg">
        <h2>Carregando artista...</h2>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen md:pl-[250px] pt-8 md:pt-0 text-white font-rubik pb-20">
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
              <h1 className="text-2xl sm:text-6xl lg:text-8xl font-extrabold mt-2">
                {artist.name}
              </h1>
              <p className="mt-2 text-sm text-[#B3B3B3]">
                Gêneros: {artist.genres.join(", ")}
              </p>
            </div>
          </div>

          <button
            className="mt-6 bg-primary text-black font-bold px-8 py-3 rounded-full hover:bg-[#1ed760] transition duration-300"
            onClick={handlePlayAll}
          >
            Play
          </button>
        </div>
      )}

      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Populares</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#333] uppercase opacity-80">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Título</th>
              <th className="py-2 px-4">Duração</th>
            </tr>
          </thead>
          <tbody>
            {topTracks
              .slice(0, showMoreTracks ? 10 : 5)
              .map((track, index) => (
                <tr
                  key={track.id}
                  className="hover:bg-[#1A1A1A] transition duration-300 cursor-pointer"
                  onClick={() => handlePlayTrack(track.uri)}
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{track.name}</td>
                  <td className="py-2 px-4">{formatDuration(track.duration_ms)}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <button
          onClick={() => setShowMoreTracks(!showMoreTracks)}
          className="mt-4 text-sm opacity-80 font-semibold hover:underline"
        >
          {showMoreTracks ? "Ver menos" : "Ver mais"}
        </button>
      </div>

      <div className="p-8">
        <a className="text-2xl font-semibold mb-4 cursor-pointer hover:underline" onClick={() => artist && navigate(`/artistas/${artist.id}`)}>Discografia</a>
        <Carousel
          items={albums.map((album) => ({
            id: album.id,
            name: album.name,
            image: album.images[0]?.url || "https://via.placeholder.com/300",
            onClick: () => navigate(`/album/${album.id}`),
          }))}
          renderItem={(item) => (
            <div
              key={item.id}
              onClick={item.onClick}
              className="p-2 cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                className="rounded-lg w-full"
              />
              <p className="text-center text-sm mt-2">{item.name}</p>
            </div>
          )}
        />
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Os fãs também curtem</h2>
        <Carousel
          items={relatedArtists.map((artist) => ({
            id: artist.id,
            name: artist.name,
            image: artist.images[0]?.url || "https://via.placeholder.com/300",
            onClick: () => navigate(`/artistas/${artist.id}`),
          }))}
          renderItem={(item) => (
            <div
              key={item.id}
              onClick={item.onClick}
              className="p-2 cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                className="rounded-lg w-full h-48 object-cover"
              />
              <p className="text-center text-sm mt-2">{item.name}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ArtistaDetails;