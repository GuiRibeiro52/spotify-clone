import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import Home from "./pages/Home";
import Artistas from "./pages/Artistas";
import Playlists from "./pages/Playlists";
import Profile from "./pages/Profile";
import Login from "./pages/Login.tsx";
import Callback from "./pages/Callback.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx"; 

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
        path: "/playlists",
        element: (
          <ProtectedRoute>
            <Playlists />
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
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/callback", element: <Callback /> },
]);
