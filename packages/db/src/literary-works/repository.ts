import { asc, eq } from "drizzle-orm";

import { getDatabase, isDatabaseConfigured } from "../client";
import { exams, literaryWorks } from "../schema";
import { literaryWorksByExam } from "./data";

const demoLiteraryWorks = Object.entries(literaryWorksByExam).flatMap(
  ([examSlug, edition]) =>
    edition.works.map((work, index) => ({
      id: `demo-${examSlug}-${index}`,
      examSlug,
      editionYear: edition.editionYear,
      title: work.title,
      author: work.author,
      sourceUrl: work.sourceUrl,
      notes: work.notes ?? null,
    })),
);

export async function listLiteraryWorks() {
  if (!isDatabaseConfigured()) return demoLiteraryWorks;
  return getDatabase()
    .select({
      id: literaryWorks.id,
      examSlug: exams.slug,
      editionYear: literaryWorks.editionYear,
      title: literaryWorks.title,
      author: literaryWorks.author,
      sourceUrl: literaryWorks.sourceUrl,
      notes: literaryWorks.notes,
    })
    .from(literaryWorks)
    .innerJoin(exams, eq(literaryWorks.examId, exams.id))
    .where(eq(literaryWorks.status, "published"))
    .orderBy(asc(exams.acronym), asc(literaryWorks.title));
}
