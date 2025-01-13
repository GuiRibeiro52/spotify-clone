import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Callback from "./Callback";
import axios from "axios";
import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const setWindowLocation = (url: string) => {
  Object.defineProperty(window, "location", {
    value: new URL(url),
    writable: true,
  });
};

describe("Página Callback", () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <Callback />
      </MemoryRouter>,
    );
  };

  it("deve renderizar a mensagem de autenticação", () => {
    renderComponent();
    expect(screen.getByText("Autenticando...")).toBeInTheDocument();
  });

  it("deve redirecionar para /login se o código de autorização não for encontrado", async () => {
    setWindowLocation("http://localhost:5173/callback"); // Sem código

    renderComponent();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("deve armazenar tokens e redirecionar para / em caso de sucesso", async () => {
    const mockTokenResponse = {
      data: {
        access_token: "fake-access-token",
        refresh_token: "fake-refresh-token",
      },
    };

    setWindowLocation("http://localhost:5173/callback?code=fake-auth-code");

    mockedAxios.post.mockResolvedValueOnce(mockTokenResponse);

    renderComponent();

    await waitFor(() => {
      expect(localStorage.getItem("spotify_access_token")).toBe(
        "fake-access-token",
      );
      expect(localStorage.getItem("spotify_refresh_token")).toBe(
        "fake-refresh-token",
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("deve exibir erro no console se a requisição do token falhar", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    setWindowLocation("http://localhost:5173/callback?code=fake-auth-code");

    mockedAxios.post.mockRejectedValueOnce(new Error("Erro ao buscar token"));

    renderComponent();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao buscar token:",
        expect.any(Error),
      );
      expect(mockNavigate).not.toHaveBeenCalledWith("/");
    });

    consoleErrorSpy.mockRestore();
  });
});
