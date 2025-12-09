export const classTypes = {
  Regular: ["Freshman Russian", "Sophomore Russian", "Junior Russian"],
  Advanced: ["Sophomore Advanced Russian", "College Russian"],
  Heritage: ["Freshman Heritage Russian", "Sophomore Heritage Russian", "College Heritage Russian"],
  Business: ["Russian in Business"]
} as const satisfies Record<classType, string[]>;

export function getGeneralClassType(specificClass: string): string | null {
  const types = Object.keys(classTypes) as Array<keyof typeof classTypes>;

  return (
    types.find(type => classTypes[type].includes(specificClass)) || null
  );
}