import { useEffect, useState } from "react";

const OfflineNotification = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-5 left-1/2 transform font-bold -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-lg shadow-lg z-50">
      ⚠️ Você está offline. Alguns recursos podem não funcionar.
    </div>
  );
};

export default OfflineNotification;