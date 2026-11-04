export const NOCTURNE_VARIANTS = ["midnight"] as const;
export const NOCTURNE_TITLES = { midnight: "Nocturne" } as const;
export type NocturneVariant = (typeof NOCTURNE_VARIANTS)[number];

export function buildNocturneDocument() {
  return "";
}
