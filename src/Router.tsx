import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import Home from "./pages/Home";
import Artistas from "./pages/Artistas";
import Playlists from "./pages/Playlists";
import Profile from "./pages/Profile";
import Login from "./pages/Login.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/artistas",
        element: <Artistas />
      },
      {
        path: "/playlists",
        element: <Playlists />
      },
      {
        path: "/profile",
        element: <Profile />
      },
    ],
  },
  {path: "/login", element: <Login />}
]);


