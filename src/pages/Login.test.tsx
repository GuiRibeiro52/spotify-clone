import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";
import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  Object.defineProperty(window, "location", {
    writable: true,
    value: { href: "" },
  });
});

describe("Login Page", () => {
  it("deve exibir o logo do Spotify", () => {
    render(<Login />);
    const logo = screen.getByAltText("Spotify Logo");
    expect(logo).toBeInTheDocument();
  });

  it("deve exibir o texto descritivo", () => {
    render(<Login />);
    const description = screen.getByText(
      /Entre com sua conta Spotify clicando no botão abaixo/i,
    );
    expect(description).toBeInTheDocument();
  });

  it("deve renderizar o botão de login", () => {
    render(<Login />);
    const button = screen.getByRole("button", { name: /entrar/i });
    expect(button).toBeInTheDocument();
  });

  it("deve redirecionar para a URL de login ao clicar no botão", () => {
    render(<Login />);
    const button = screen.getByRole("button", { name: /entrar/i });

    fireEvent.click(button);

    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    const REDIRECT_URI =
    import.meta.env.MODE === "development"
      ? "http://localhost:5173/callback"
      : "https://spotify-clone-ten-gilt.vercel.app/callback";
    const SCOPES = [
      "user-read-private",
      "user-read-email",
      "playlist-read-private",
      "playlist-read-collaborative",
      "playlist-modify-public",
      "playlist-modify-private",
      "user-top-read",
    ];

    const expectedUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(
      SCOPES.join(" "),
    )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&show_dialog=true`;

    expect(window.location.href).toBe(expectedUrl);
  });
});
