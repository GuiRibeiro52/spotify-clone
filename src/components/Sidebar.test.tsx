import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";
import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("react-icons/fa", () => ({
  FaBars: () => <div data-testid="fa-bars">FaBars Icon</div>,
  FaTimes: () => <div data-testid="fa-times">FaTimes Icon</div>,
}));

vi.mock("../assets/images/SpotifyLogo.png", () => ({
  default: "spotify-logo.png",
}));
vi.mock("../assets/images/home.png", () => ({ default: "home.png" }));
vi.mock("../assets/images/home-inativo.png", () => ({
  default: "home-inativo.png",
}));
vi.mock("../assets/images/play.png", () => ({ default: "play.png" }));
vi.mock("../assets/images/play-inativo.png", () => ({
  default: "play-inativo.png",
}));
vi.mock("../assets/images/disc.png", () => ({ default: "disc.png" }));
vi.mock("../assets/images/disc-inativo.png", () => ({
  default: "disc-inativo.png",
}));
vi.mock("../assets/images/user.png", () => ({ default: "user.png" }));
vi.mock("../assets/images/user-inativo.png", () => ({
  default: "user-inativo.png",
}));

describe("Sidebar", () => {
  it("deve renderizar todos os links corretamente", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("Home")).toHaveLength(2);
    expect(screen.getAllByText("Artistas")).toHaveLength(2);
    expect(screen.getAllByText("Playlists")).toHaveLength(2);
    expect(screen.getAllByText("Perfil")).toHaveLength(2);
  });

  it("deve destacar o link ativo corretamente", () => {
    render(
      <MemoryRouter initialEntries={["/playlists"]}>
        <Sidebar />
      </MemoryRouter>,
    );

    const playlistLinks = screen.getAllByText("Playlists");

    playlistLinks.forEach((link) => {
      expect(link).toHaveStyle("color: #FFFFFF");
    });
  });

  it("deve abrir e fechar o menu mobile ao clicar no botão", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    const menuButton = screen.getByTestId("fa-bars");
    fireEvent.click(menuButton);

    expect(screen.getByTestId("fa-times")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("fa-times"));
    expect(screen.getByTestId("fa-bars")).toBeInTheDocument();
  });

  it("deve fechar o menu ao clicar em um link", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    const menuButton = screen.getByTestId("fa-bars");
    fireEvent.click(menuButton);

    const homeLinks = screen.getAllByText("Home");
    fireEvent.click(homeLinks[1]);

    expect(screen.getByTestId("fa-bars")).toBeInTheDocument();
  });
});
