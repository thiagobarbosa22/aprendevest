import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "./password";

describe("password", () => {
  it("usa salt único e valida apenas a senha correta", async () => {
    const first = await hashPassword("vestibular2026");
    const second = await hashPassword("vestibular2026");

    expect(first).not.toBe(second);
    await expect(verifyPassword("vestibular2026", first)).resolves.toBe(true);
    await expect(verifyPassword("senha-incorreta", first)).resolves.toBe(false);
  });

  it("recusa um hash malformado", async () => {
    await expect(verifyPassword("qualquer", "inválido")).resolves.toBe(false);
  });
});
