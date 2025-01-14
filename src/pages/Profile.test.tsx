import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Profile from "./Profile";
import axios from "axios";
import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Profile Page", () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderWithRouter = (initialRoute: string) => {
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it("deve exibir o nome e a imagem do usuário após carregamento", async () => {
    const mockUserData = {
      display_name: "Usuário Teste",
      images: [{ url: "https://via.placeholder.com/150" }],
    };

    localStorage.setItem("spotify_access_token", "fake-token");
    mockedAxios.get.mockResolvedValueOnce({ data: mockUserData });

    renderWithRouter("/profile");

    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Usuário Teste")).toBeInTheDocument();
      expect(screen.getByAltText("Usuário Teste")).toHaveAttribute(
        "src",
        "https://via.placeholder.com/150",
      );
    });
  });

  it("deve redirecionar para a página de login se o token estiver ausente", async () => {
    renderWithRouter("/profile");

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("deve redirecionar para login se a requisição falhar", async () => {
    localStorage.setItem("spotify_access_token", "invalid-token");
    mockedAxios.get.mockRejectedValueOnce(new Error("Erro de autenticação"));

    renderWithRouter("/profile");

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("deve executar logout ao clicar no botão 'Sair'", async () => {
    const mockUserData = {
      display_name: "Usuário Teste",
      images: [{ url: "https://via.placeholder.com/150" }],
    };

    localStorage.setItem("spotify_access_token", "fake-token");
    mockedAxios.get.mockResolvedValueOnce({ data: mockUserData });

    renderWithRouter("/profile");

    await waitFor(() => {
      expect(screen.getByText("Usuário Teste")).toBeInTheDocument();
    });

    const logoutButton = screen.getByText("Sair");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(localStorage.getItem("spotify_access_token")).toBeNull();
      expect(localStorage.getItem("spotify_refresh_token")).toBeNull();
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("deve exibir imagem padrão se o usuário não tiver imagem", async () => {
    const mockUserData = {
      display_name: "Usuário Sem Imagem",
      images: [],
    };

    localStorage.setItem("spotify_access_token", "fake-token");
    mockedAxios.get.mockResolvedValueOnce({ data: mockUserData });

    renderWithRouter("/profile");

    await waitFor(() => {
      expect(screen.getByAltText("Usuário Sem Imagem")).toHaveAttribute(
        "src",
        "https://via.placeholder.com/150",
      );
    });
  });
});
