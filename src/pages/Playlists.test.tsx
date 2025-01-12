import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Playlists from "./Playlists";
import axios from "axios";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock do axios
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Página Playlists", () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <Playlists />
      </MemoryRouter>,
    );
  };

  it("deve renderizar o título 'Minhas Playlists'", () => {
    renderComponent();
    expect(screen.getByText("Minhas Playlists")).toBeInTheDocument();
    expect(
      screen.getByText("Sua coleção pessoal de playlists"),
    ).toBeInTheDocument();
  });

  it("deve abrir e fechar o modal de criação de playlist", async () => {
    renderComponent();

    const createButton = screen.getByText("Criar playlist");
    fireEvent.click(createButton);

    expect(
      await screen.findByText("Dê um nome a sua playlist"),
    ).toBeInTheDocument();

    const closeButton = screen.getByText("✕");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Dê um nome a sua playlist"),
      ).not.toBeInTheDocument();
    });
  });

  it("deve lidar com erro ao buscar playlists", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    localStorage.setItem("spotify_access_token", "fake-token");
    mockedAxios.get.mockRejectedValueOnce(
      new Error("Erro ao buscar playlists"),
    );

    renderComponent();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao buscar playlists:",
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("não deve tentar carregar playlists se o token estiver ausente", async () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    renderComponent();

    await waitFor(() => {
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    consoleWarnSpy.mockRestore();
  });
});
