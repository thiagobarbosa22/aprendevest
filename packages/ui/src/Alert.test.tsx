import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert } from "./Alert.js";

describe("Alert", () => {
  it("erro usa role=alert para ser anunciado imediatamente", () => {
    render(
      <Alert variant="error">Não foi possível salvar sua resposta.</Alert>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível salvar sua resposta.",
    );
  });

  it("info usa role=status, não role=alert", () => {
    render(<Alert variant="info">Seu plano foi recalculado.</Alert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
