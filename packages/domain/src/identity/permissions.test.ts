import { describe, expect, it } from "vitest";

import { can } from "./permissions";

describe("can", () => {
  it("mantém o estudante restrito aos próprios dados", () => {
    expect(can("student", "profile:update:self")).toBe(true);
    expect(can("student", "content:publish")).toBe(false);
  });

  it("separa autoria, revisão e publicação", () => {
    expect(can("author", "content:create")).toBe(true);
    expect(can("author", "content:review")).toBe(false);
    expect(can("reviewer", "content:review")).toBe(true);
    expect(can("reviewer", "content:publish")).toBe(false);
    expect(can("editor", "content:publish")).toBe(true);
  });

  it("concede ao administrador as permissões sensíveis", () => {
    expect(can("admin", "content:delete")).toBe(true);
    expect(can("admin", "users:manage")).toBe(true);
    expect(can("admin", "audit:read")).toBe(true);
  });
});
