const paths: Record<string, string> = {
  mathematics: "M4 4v16h16 M8 16l3-5 2 3 4-7 M4 4l4-2 M20 20l-2 4",
  languages:
    "M4 5h11a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H10l-4 4v-4H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3 3-3 0 0 0-3 0Z",
  natural_sciences:
    "M9 3h6 M10 3v6l-5.5 9a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3 M8 15h8",
  human_sciences:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M3 12h18 M12 3c2.5 2.4 4 5.6 4 9s-1.5 6.6-4 9c-2.5-2.4-4-5.6-4-9s1.5-6.6 4-9Z",
  interdisciplinary: "M12 3 4 8l8 5 8-5-8-5Z M4 16l8 5 8-5 M4 12l8 5 8-5",
};

export function SubjectIcon({
  area,
  className = "h-6 w-6",
}: {
  area: string;
  className?: string;
}) {
  const d = paths[area] ?? paths.interdisciplinary;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
