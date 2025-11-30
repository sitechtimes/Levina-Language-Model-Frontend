export const classColors = {
  Regular: "var(--regular)", //blue
  Advanced: "var(--advanced)", //green
  Heritage: "var(--heritage)", //pink
  Business: "var(--business)", //yellow
} as const;

export type classType = keyof typeof classColors;