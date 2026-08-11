import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  return [
    "",
    "/vestibulares",
    "/materias",
    "/aulas/funcoes-primeiros-passos",
    "/questoes",
    "/provas",
    "/simulados",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path ? "weekly" : "daily",
    priority: path ? 0.8 : 1,
  }));
}
