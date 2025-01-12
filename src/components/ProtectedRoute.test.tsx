import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import "@testing-library/jest-dom";

const ProtectedContent = () => <h1>Conteúdo Protegido</h1>;

describe("Componente ProtectedRoute", () => {
  afterEach(() => {
    localStorage.clear();
  });

  const renderWithRouter = (initialRoute: string) => {
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<h1>Página de Login</h1>} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it("deve redirecionar para /login se o token não estiver presente", () => {
    renderWithRouter("/");

    expect(screen.getByText("Página de Login")).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo Protegido")).not.toBeInTheDocument();
  });

  it("deve renderizar o conteúdo protegido se o token estiver presente", () => {
    localStorage.setItem("spotify_access_token", "fake-token");

    renderWithRouter("/");

    expect(screen.getByText("Conteúdo Protegido")).toBeInTheDocument();
    expect(screen.queryByText("Página de Login")).not.toBeInTheDocument();
  });

  it("deve manter o usuário na rota protegida se o token for válido", () => {
    localStorage.setItem("spotify_access_token", "valid-token");

    renderWithRouter("/");

    expect(screen.getByText("Conteúdo Protegido")).toBeInTheDocument();
  });

  it("deve redirecionar para /login se o token for inválido ou vazio", () => {
    localStorage.setItem("spotify_access_token", "");

    renderWithRouter("/");

    expect(screen.getByText("Página de Login")).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo Protegido")).not.toBeInTheDocument();
  });
});
