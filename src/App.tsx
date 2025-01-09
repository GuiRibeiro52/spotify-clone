import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

function App() {
  const token = localStorage.getItem("spotify_access_token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
