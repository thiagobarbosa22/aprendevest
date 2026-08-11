export const editorialStatuses = [
  "draft",
  "in_review",
  "approved",
  "published",
  "archived",
  "blocked",
] as const;

export type EditorialStatus = (typeof editorialStatuses)[number];

const transitions: Record<EditorialStatus, readonly EditorialStatus[]> = {
  draft: ["in_review", "archived", "blocked"],
  in_review: ["draft", "approved", "blocked"],
  approved: ["draft", "published", "blocked"],
  published: ["archived", "blocked"],
  archived: ["draft"],
  blocked: ["draft", "archived"],
};

export function canTransitionEditorialStatus(
  from: EditorialStatus,
  to: EditorialStatus,
): boolean {
  return transitions[from].includes(to);
}

export function assertPublishableMetadata(input: {
  sourceUrl?: string | null;
  rightsStatus?: string | null;
  authorId?: string | null;
  reviewerId?: string | null;
}): void {
  const missing = [
    !input.sourceUrl && "fonte",
    !input.rightsStatus && "direitos",
    !input.authorId && "autoria",
    !input.reviewerId && "revisão",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Publicação bloqueada: informe ${missing.join(", ")}.`);
  }
}
