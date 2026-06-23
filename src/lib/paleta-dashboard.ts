export const PALETA_VERDES = [
  '#22c55e',
  '#16a34a',
  '#15803d',
  '#4ade80',
  '#86efac',
  '#166534',
  '#14532d',
  '#bbf7d0',
  '#10b981',
  '#059669',
]

export const PALETA_DONUT = [
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#a855f7',
  '#ec4899',
  '#f43f5e',
  '#f97316',
]

export function colorSegmento(index: number): string {
  return PALETA_VERDES[index % PALETA_VERDES.length]
}

export function colorDonut(index: number): string {
  return PALETA_DONUT[index % PALETA_DONUT.length]
}
