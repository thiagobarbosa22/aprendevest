import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  completeProfile: vi.fn(),
  createStudent: vi.fn(),
  findActiveUserByEmail: vi.fn(),
  requestUserDeletion: vi.fn(),
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
  createSession: vi.fn(),
  deleteSession: vi.fn(),
  getCurrentUser: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock("@aprendevest/db", () => ({
  completeProfile: mocks.completeProfile,
  createStudent: mocks.createStudent,
  findActiveUserByEmail: mocks.findActiveUserByEmail,
  requestUserDeletion: mocks.requestUserDeletion,
}));
vi.mock("../../lib/auth/password", () => ({
  hashPassword: mocks.hashPassword,
  verifyPassword: mocks.verifyPassword,
}));
vi.mock("../../lib/auth/session", () => ({
  createSession: mocks.createSession,
  deleteSession: mocks.deleteSession,
  getCurrentUser: mocks.getCurrentUser,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { finishOnboarding, login, signup } from "./auth";

describe("ações de identidade", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("interrompe cadastro inválido antes do banco", async () => {
    const form = new FormData();
    form.set("name", "A");
    form.set("email", "inválido");
    form.set("password", "curta");

    const result = await signup({}, form);

    expect(result.errors).toBeDefined();
    expect(mocks.createStudent).not.toHaveBeenCalled();
  });

  it("cria conta, consentimento e sessão com dados válidos", async () => {
    mocks.hashPassword.mockResolvedValue("hash");
    mocks.createStudent.mockResolvedValue({ id: "user-1", role: "student" });
    const form = new FormData();
    form.set("name", "Ana Lima");
    form.set("email", "ana@example.com");
    form.set("password", "vestibular2026");
    form.set("privacyAccepted", "on");

    await expect(signup({}, form)).rejects.toThrow("REDIRECT:/boas-vindas");
    expect(mocks.createStudent).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "ana@example.com",
        policyVersion: "2026-08-11",
      }),
    );
    expect(mocks.createSession).toHaveBeenCalledWith("user-1");
  });

  it("não revela se o e-mail existe no login", async () => {
    mocks.findActiveUserByEmail.mockResolvedValue(null);
    mocks.hashPassword.mockResolvedValue("dummy-hash");
    const form = new FormData();
    form.set("email", "ninguem@example.com");
    form.set("password", "vestibular2026");

    const result = await login({}, form);

    expect(result.message).toBe("E-mail ou senha incorretos.");
    expect(mocks.createSession).not.toHaveBeenCalled();
  });

  it("salva objetivo somente para uma sessão válida", async () => {
    mocks.getCurrentUser.mockResolvedValue({ userId: "user-1" });
    const form = new FormData();
    form.set("targetCourse", "Medicina");
    form.append("targetExams", "ENEM");
    form.set("weeklyMinutes", "300");
    form.set("currentLevel", "beginner");
    form.set("ageGroup", "adult");

    await expect(finishOnboarding({}, form)).rejects.toThrow("REDIRECT:/app");
    expect(mocks.completeProfile).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({ weeklyMinutes: 300, targetExams: ["ENEM"] }),
    );
  });
});
