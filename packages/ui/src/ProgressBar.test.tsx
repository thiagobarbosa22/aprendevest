import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProgressBar } from "./ProgressBar.js";

describe("ProgressBar", () => {
  it("expõe valor numérico via role progressbar, não só visual", () => {
    render(<ProgressBar value={3} max={5} label="Progresso semanal" />);
    const bar = screen.getByRole("progressbar", { name: "Progresso semanal" });
    expect(bar).toHaveAttribute("aria-valuenow", "3");
    expect(bar).toHaveAttribute("aria-valuemax", "5");
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("nunca ultrapassa 100% mesmo com valor acima do máximo", () => {
    render(<ProgressBar value={99} max={5} label="Progresso" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "5",
    );
  });
});
