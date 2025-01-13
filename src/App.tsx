import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import OfflineNotification from "./components/OfflineNotification";

function App() {
  const token = localStorage.getItem("spotify_access_token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-[#090707]">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
      <OfflineNotification />
    </div>
  );
}

export default App;