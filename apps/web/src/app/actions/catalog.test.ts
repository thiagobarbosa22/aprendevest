import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createExamDraft: vi.fn(),
  publishExam: vi.fn(),
  transitionExamStatus: vi.fn(),
  requirePermission: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@aprendevest/db", () => ({
  createExamDraft: mocks.createExamDraft,
  publishExam: mocks.publishExam,
  transitionExamStatus: mocks.transitionExamStatus,
}));
vi.mock("../../lib/auth/guards", () => ({
  requirePermission: mocks.requirePermission,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import {
  approveExamAction,
  createExam,
  publishExamAction,
  submitExamForReviewAction,
} from "./catalog";

describe("ações do catálogo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requirePermission.mockResolvedValue({ userId: "editor-1" });
  });

  it("não grava um item editorial sem fonte válida", async () => {
    const form = new FormData();
    form.set("name", "Vestibular de teste");
    const result = await createExam({}, form);
    expect(result.errors).toBeDefined();
    expect(mocks.createExamDraft).not.toHaveBeenCalled();
  });

  it("cria um rascunho rastreável", async () => {
    const result = await createExam({}, validExamForm());
    expect(result.success).toBe(true);
    expect(mocks.requirePermission).toHaveBeenCalledWith("content:create");
    expect(mocks.createExamDraft).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "enem-teste" }),
      "editor-1",
    );
  });

  it("aplica as três etapas e permissões do workflow", async () => {
    const form = new FormData();
    form.set("examId", "exam-1");
    await submitExamForReviewAction(form);
    expect(mocks.transitionExamStatus).toHaveBeenCalledWith(
      "exam-1",
      "in_review",
      "editor-1",
    );
    await approveExamAction(form);
    expect(mocks.requirePermission).toHaveBeenCalledWith("content:review");
    expect(mocks.transitionExamStatus).toHaveBeenCalledWith(
      "exam-1",
      "approved",
      "editor-1",
    );
    await publishExamAction(form);
    expect(mocks.requirePermission).toHaveBeenCalledWith("content:publish");
    expect(mocks.publishExam).toHaveBeenCalledWith("exam-1", "editor-1");
  });
});

function validExamForm() {
  const form = new FormData();
  const values = {
    name: "Vestibular de teste",
    acronym: "VT",
    slug: "enem-teste",
    institution: "Instituição de teste",
    board: "Banca de teste",
    region: "Brasil",
    officialUrl: "https://example.org/oficial",
    sourceUrl: "https://example.org/fonte",
    rightsStatus: "official_link",
    summary:
      "Item inteiramente sintético usado para validar o workflow editorial.",
  };
  Object.entries(values).forEach(([key, value]) => form.set(key, value));
  return form;
}
