import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import Home from "./pages/Home";
import Artistas from "./pages/Artistas";
import Playlists from "./pages/Playlists";
import Profile from "./pages/Profile";
import Login from "./pages/Login.tsx";
import Callback from "./pages/Callback.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Albums from "./pages/Albums.tsx";
import PlaylistDetails from "./pages/PlaylistDetails.tsx";
import AlbumDetails from "./pages/AlbumDetails.tsx";
import Podcasts from "./pages/Podcasts.tsx";
import PodcastDetails from "./pages/PodcastDetails.tsx";
import SearchResults from "./pages/SearchResults.tsx";
import ArtistaDetails from "./pages/ArtistaDetails.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/artistas",
        element: (
          <ProtectedRoute>
            <Artistas />
          </ProtectedRoute>
        ),
      },
      {
        path: "/artistas/:artistId",
        element: (
          <ProtectedRoute>
            <Albums />
          </ProtectedRoute>
        ),
      },
      {
        path: "/artistas/:artistId/details",
        element: (
          <ProtectedRoute>
            <ArtistaDetails />
          </ProtectedRoute>
        ),
      },
      
      {
        path: "/album/:albumId",
        element: (
          <ProtectedRoute>
            <AlbumDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/playlists",
        element: (
          <ProtectedRoute>
            <Playlists />
          </ProtectedRoute>
        ),
      },
      {
        path: "/playlists/:playlistId",
        element: (
          <ProtectedRoute>
            <PlaylistDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/podcasts",
        element: (
          <ProtectedRoute>
            <Podcasts />
          </ProtectedRoute>
        ),
      },
      {
        path: "/podcasts/:podcastId",
        element: (
          <ProtectedRoute>
            <PodcastDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/search-results",
        element: (
          <ProtectedRoute>
            <SearchResults />
          </ProtectedRoute>
        ),
      }      
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/callback", element: <Callback /> },
]);
