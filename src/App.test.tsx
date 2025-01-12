import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("./components/Sidebar", () => ({
  default: () => <div>Sidebar Mock</div>,
}));

describe("Componente App", () => {
  afterEach(() => {
    localStorage.clear();
  });

  const renderWithRouter = (initialRoute: string) => {
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="home" element={<h1>Home Page</h1>} />
          </Route>
          <Route path="/login" element={<h1>Página de Login</h1>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("deve redirecionar para /login se o token não estiver presente", () => {
    renderWithRouter("/");

    expect(screen.getByText("Página de Login")).toBeInTheDocument();
    expect(screen.queryByText("Sidebar Mock")).not.toBeInTheDocument();
  });

  it("deve renderizar a Sidebar e o conteúdo se o token estiver presente", () => {
    localStorage.setItem("spotify_access_token", "fake-token");

    renderWithRouter("/home");

    expect(screen.getByText("Sidebar Mock")).toBeInTheDocument();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("não deve redirecionar se o token for válido", () => {
    localStorage.setItem("spotify_access_token", "valid-token");

    renderWithRouter("/home");

    expect(screen.queryByText("Página de Login")).not.toBeInTheDocument();
    expect(screen.getByText("Sidebar Mock")).toBeInTheDocument();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("deve redirecionar para /login se o token estiver vazio", () => {
    localStorage.setItem("spotify_access_token", "");

    renderWithRouter("/");

    expect(screen.getByText("Página de Login")).toBeInTheDocument();
  });
});
