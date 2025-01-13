import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Spotify Clone",
        short_name: "SpotifyClone",
        description: "Um clone do Spotify com suporte offline",
        theme_color: "#1DB954",
        background_color: "#191414",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "//public/spotify_logo_icon_128.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/public/spotify_logo_icon_512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/public/spotify_logo_icon_512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});