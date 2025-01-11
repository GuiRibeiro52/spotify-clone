import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Artistas from "./Artistas";
import axios from "axios";
import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Página Artistas", () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderWithRouter = (initialRoute: string) => {
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/artistas" element={<Artistas />} />
          <Route path="/artistas/:id" element={<div>Detalhe do Artista</div>} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it("deve renderizar o título 'Top Artistas'", () => {
    renderWithRouter("/artistas");
    expect(screen.getByText("Top Artistas")).toBeInTheDocument();
    expect(
      screen.getByText("Aqui você encontra seus artistas preferidos"),
    ).toBeInTheDocument();
  });

  it("deve carregar e exibir os artistas corretamente", async () => {
    const mockArtists = {
      items: [
        {
          id: "1",
          name: "Artista 1",
          images: [{ url: "https://via.placeholder.com/64" }],
        },
        {
          id: "2",
          name: "Artista 2",
          images: [{ url: "https://via.placeholder.com/64" }],
        },
      ],
    };

    localStorage.setItem("spotify_access_token", "fake-token");
    mockedAxios.get.mockResolvedValueOnce({ data: mockArtists });

    renderWithRouter("/artistas");

    await waitFor(() => {
      expect(screen.getByText("Artista 1")).toBeInTheDocument();
      expect(screen.getByText("Artista 2")).toBeInTheDocument();
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });
  });

  it("deve exibir a mensagem 'Nenhum artista encontrado' se a lista estiver vazia", async () => {
    const mockEmptyResponse = { items: [] };

    localStorage.setItem("spotify_access_token", "fake-token");
    mockedAxios.get.mockResolvedValueOnce({ data: mockEmptyResponse });

    renderWithRouter("/artistas");

    await waitFor(() => {
      expect(
        screen.getByText("Nenhum artista encontrado."),
      ).toBeInTheDocument();
    });
  });

  it("deve redirecionar para a página de detalhes ao clicar em um artista", async () => {
    const mockArtists = {
      items: [
        {
          id: "1",
          name: "Artista Clicável",
          images: [{ url: "https://via.placeholder.com/64" }],
        },
      ],
    };

    localStorage.setItem("spotify_access_token", "fake-token");
    mockedAxios.get.mockResolvedValueOnce({ data: mockArtists });

    renderWithRouter("/artistas");

    await waitFor(() => {
      expect(screen.getByText("Artista Clicável")).toBeInTheDocument();
    });

    const artistItem = screen.getByText("Artista Clicável");
    fireEvent.click(artistItem);

    await waitFor(() => {
      expect(screen.getByText("Detalhe do Artista")).toBeInTheDocument();
    });
  });

  it("deve exibir um erro no console se a requisição falhar", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    localStorage.setItem("spotify_access_token", "fake-token");
    mockedAxios.get.mockRejectedValueOnce(new Error("Erro de API"));

    renderWithRouter("/artistas");

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro inesperado:",
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("não deve tentar carregar artistas se o token estiver ausente", async () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    renderWithRouter("/artistas");

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Token não encontrado. Faça login novamente.",
      );
    });

    consoleWarnSpy.mockRestore();
  });
});
