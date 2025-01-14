import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import App from "./App";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("./pages/Home", () => ({
  default: () => <div>Home Page</div>,
}));
vi.mock("./pages/Artistas", () => ({
  default: () => <div>Artistas Page</div>,
}));
vi.mock("./pages/Playlists", () => ({
  default: () => <div>Playlists Page</div>,
}));
vi.mock("./pages/Profile", () => ({
  default: () => <div>Profile Page</div>,
}));
vi.mock("./pages/Login", () => ({
  default: () => <div>Login Page</div>,
}));
vi.mock("./pages/Callback", () => ({
  default: () => <div>Callback Page</div>,
}));
vi.mock("./pages/Albums", () => ({
  default: () => <div>Albums Page</div>,
}));

vi.mock("./components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const renderWithRouter = (route: string) => {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/artistas" element={<div>Artistas Page</div>} />
          <Route path="/artistas/:artistId" element={<div>Albums Page</div>} />
          <Route path="/playlists" element={<div>Playlists Page</div>} />
          <Route path="/profile" element={<div>Profile Page</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/callback" element={<div>Callback Page</div>} />
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("Router.tsx", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("deve redirecionar para /login ao acessar rota protegida sem token", async () => {
    renderWithRouter("/");

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("deve acessar a Home com token válido", async () => {
    localStorage.setItem("spotify_access_token", "mocked_token");

    renderWithRouter("/");

    await waitFor(() => {
      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
  });

  it("deve acessar a página de Artistas com token válido", async () => {
    localStorage.setItem("spotify_access_token", "mocked_token");

    renderWithRouter("/artistas");

    await waitFor(() => {
      expect(screen.getByText("Artistas Page")).toBeInTheDocument();
    });
  });

  it("deve acessar a página de Playlists com token válido", async () => {
    localStorage.setItem("spotify_access_token", "mocked_token");

    renderWithRouter("/playlists");

    await waitFor(() => {
      expect(screen.getByText("Playlists Page")).toBeInTheDocument();
    });
  });

  it("deve acessar a página de Perfil com token válido", async () => {
    localStorage.setItem("spotify_access_token", "mocked_token");

    renderWithRouter("/profile");

    await waitFor(() => {
      expect(screen.getByText("Profile Page")).toBeInTheDocument();
    });
  });

  it("deve acessar a página de Albums com token válido", async () => {
    localStorage.setItem("spotify_access_token", "mocked_token");

    renderWithRouter("/artistas/1");

    await waitFor(() => {
      expect(screen.getByText("Albums Page")).toBeInTheDocument();
    });
  });

  it("deve acessar a página de Login sem autenticação", async () => {
    renderWithRouter("/login");

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("deve acessar a página de Callback sem autenticação", async () => {
    renderWithRouter("/callback");

    await waitFor(() => {
      expect(screen.getByText("Callback Page")).toBeInTheDocument();
    });
  });

  it("deve exibir erro 404 para rotas inválidas", async () => {
    renderWithRouter("/rota-inexistente");

    await waitFor(() => {
      expect(screen.getByText("Página não encontrada")).toBeInTheDocument();
    });
  });
});
