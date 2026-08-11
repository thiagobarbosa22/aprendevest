import type { EnemApiQuestion } from "../schema/enem-simulation";

const ENEM_API_BASE = "https://api.enem.dev/v1";
const PAGE_SIZE = 50;

type EnemApiPage = {
  metadata: { limit: number; offset: number; total: number; hasMore: boolean };
  questions: EnemApiQuestion[];
};

/**
 * Fetches every question for a given ENEM year straight from the public
 * api.enem.dev (GPL-2.0, community-maintained mirror of INEP's official
 * released exams). The API caps `limit` at 50, so a full year needs a few
 * sequential pages — callers should cache the result (see
 * getOrFetchEnemYear) since this hits an external rate limit.
 */
export async function fetchEnemYear(year: number): Promise<EnemApiQuestion[]> {
  const seen = new Map<number, EnemApiQuestion>();
  let offset = 0;
  for (let page = 0; page < 10; page++) {
    const url = new URL(`${ENEM_API_BASE}/exams/${year}/questions`);
    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("offset", String(offset));
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) {
      throw new Error(
        `Falha ao buscar a prova do ENEM ${year} (HTTP ${response.status}).`,
      );
    }
    const data = (await response.json()) as EnemApiPage;
    for (const question of data.questions) seen.set(question.index, question);
    if (!data.metadata.hasMore) break;
    offset += PAGE_SIZE;
  }
  return [...seen.values()].sort((a, b) => a.index - b.index);
}
