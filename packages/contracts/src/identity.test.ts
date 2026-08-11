import { describe, expect, it } from "vitest";

import { onboardingSchema, registrationSchema } from "./identity";

describe("registrationSchema", () => {
  it("normaliza um cadastro válido", () => {
    const result = registrationSchema.parse({
      name: "  Ana Lima  ",
      email: " ANA@EXAMPLE.COM ",
      password: "vestibular2026",
      privacyAccepted: true,
    });

    expect(result).toMatchObject({
      name: "Ana Lima",
      email: "ana@example.com",
    });
  });

  it("recusa senha fraca e ausência de consentimento", () => {
    expect(() =>
      registrationSchema.parse({
        name: "Ana",
        email: "ana@example.com",
        password: "curta",
        privacyAccepted: false,
      }),
    ).toThrow();
  });
});

describe("onboardingSchema", () => {
  it("limita uma carga semanal excessiva", () => {
    expect(() =>
      onboardingSchema.parse({
        targetCourse: "Medicina",
        targetExams: ["ENEM"],
        weeklyMinutes: 9_000,
        currentLevel: "beginner",
        ageGroup: "adult",
      }),
    ).toThrow();
  });
});
