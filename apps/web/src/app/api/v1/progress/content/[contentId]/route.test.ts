import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  getContentProgress: vi.fn(),
  saveContentProgress: vi.fn(),
}));

vi.mock("../../../../../../lib/auth/session", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));
vi.mock("@aprendevest/db", () => ({
  getContentProgress: mocks.getContentProgress,
  saveContentProgress: mocks.saveContentProgress,
}));

import { GET, PUT } from "./route";

const id = "c69e0764-0cbe-4be3-a81d-a4d81879d061";
const context = { params: Promise.resolve({ contentId: id }) };

describe("progresso de conteúdo", () => {
  beforeEach(() => vi.clearAllMocks());

  it("protege leitura sem sessão", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);
    const response = await GET(new Request("http://localhost"), context);
    expect(response.status).toBe(401);
  });

  it("valida e persiste progresso para o titular", async () => {
    mocks.getCurrentUser.mockResolvedValue({ userId: "user-1" });
    mocks.saveContentProgress.mockResolvedValue({
      percent: 60,
      status: "in_progress",
    });
    const response = await PUT(
      new Request("http://localhost", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percent: 60, positionSeconds: 120 }),
      }),
      context,
    );
    expect(response.status).toBe(200);
    expect(mocks.saveContentProgress).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({ contentId: id, percent: 60 }),
    );
  });

  it("recusa payload fora do contrato", async () => {
    mocks.getCurrentUser.mockResolvedValue({ userId: "user-1" });
    const response = await PUT(
      new Request("http://localhost", {
        method: "PUT",
        body: JSON.stringify({ percent: 900 }),
      }),
      context,
    );
    expect(response.status).toBe(400);
    expect(mocks.saveContentProgress).not.toHaveBeenCalled();
  });
});
