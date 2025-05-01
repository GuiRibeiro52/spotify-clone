import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { usePlayer } from "./context/PlayerContext";
import Player from "./components/Player";

function App() {
  const { token, currentTrackUri } = usePlayer();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full h-screen overflow-y-scroll">
        <Outlet />
      </div>
      {token && currentTrackUri.length > 0 && <Player token={token} uris={currentTrackUri} />}
    </div>
  );
}

export default App;