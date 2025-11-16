export const subjectColors = {
  Regular: "var(--regular)", //blue
  Advanced: "var(--advanced)", //green
  Heritage: "var(--heritage)", //pink
  Business: "var(--business)", //yellow
} as const;

export type Subject = keyof typeof subjectColors;