import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Albums from "./Albums";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (route: string) => {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/artistas/:artistId" element={<Albums />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("Albums Page", () => {
  beforeEach(() => {
    localStorage.setItem("spotify_access_token", "mocked_token");
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("deve renderizar os álbuns corretamente", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { name: "Artista Teste", images: [{ url: "artist-image-url" }] },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: "1",
            name: "Álbum 1",
            release_date: "2022-01-01",
            images: [{ url: "album1-url" }],
          },
          {
            id: "2",
            name: "Álbum 2",
            release_date: "2022-02-01",
            images: [{ url: "album2-url" }],
          },
        ],
      },
    });

    renderWithRouter("/artistas/1");

    await waitFor(() => {
      expect(screen.getByText("Álbum 1")).toBeInTheDocument();
      expect(screen.getByText("Álbum 2")).toBeInTheDocument();
    });
  });

  it("deve lidar com erro na busca de álbuns", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Erro de conexão"));

    renderWithRouter("/artistas/1");

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  it("deve navegar para página anterior ao clicar no botão de voltar", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { name: "Artista Teste", images: [{ url: "artist-image-url" }] },
    });

    renderWithRouter("/artistas/1");

    const backButton = await screen.findByRole("button");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("deve paginar corretamente", async () => {
    const albumsMock = Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Álbum ${i + 1}`,
      release_date: "2022-01-01",
      images: [{ url: `album${i + 1}-url` }],
    }));

    mockedAxios.get.mockResolvedValueOnce({
      data: { name: "Artista Teste", images: [{ url: "artist-image-url" }] },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: { items: albumsMock },
    });

    renderWithRouter("/artistas/1");

    await waitFor(() => {
      expect(screen.getByText("Álbum 1")).toBeInTheDocument();
      expect(screen.queryByText("Álbum 11")).not.toBeInTheDocument();
    });

    const nextPageButton = screen.getByText("2");
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(screen.getByText("Álbum 11")).toBeInTheDocument();
    });
  });

  it("deve exibir imagem padrão se o álbum não tiver imagem", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { name: "Artista Teste", images: [{ url: "artist-image-url" }] },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: "1",
            name: "Álbum Sem Imagem",
            release_date: "2022-01-01",
            images: [],
          },
        ],
      },
    });

    renderWithRouter("/artistas/1");

    const albumImage = await screen.findByAltText("Álbum Sem Imagem");
    expect(albumImage).toHaveAttribute("src", "https://via.placeholder.com/64");
  });
});
