// This function registers the service worker and handles updates
export function register() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = "/service-worker.js";

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log("Service Worker registrado com sucesso:", registration);

          // Check for updates on page load
          registration.addEventListener("updatefound", () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener("statechange", () => {
                if (installingWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    // At this point, the updated precached content has been fetched,
                    // but the previous service worker will still serve the older
                    // content until all client tabs are closed.
                    console.log("Nova versão disponível! Recarregue a página para atualizar.");
                    
                    // Optional: Show a notification to the user about the update
                    if ("Notification" in window && Notification.permission === "granted") {
                      new Notification("Spotify Clone Atualizado", {
                        body: "Uma nova versão está disponível. Recarregue a página para atualizar.",
                        icon: "/pwa-spotify-192x192.png"
                      });
                    }
                  } else {
                    // At this point, everything has been precached.
                    console.log("Conteúdo em cache para uso offline.");
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("Erro ao registrar o Service Worker:", error);
        });
    });
  }
}

// This function unregisters the service worker
export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Register the service worker by default
register();
