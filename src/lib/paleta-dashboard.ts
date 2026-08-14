export const PALETA_VERDES = [
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-1)',
  'var(--chart-5)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-2)',
  'var(--chart-1)',
  'var(--chart-5)',
]

export const PALETA_DONUT = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function colorSegmento(index: number): string {
  return PALETA_VERDES[index % PALETA_VERDES.length]
}

export function colorDonut(index: number): string {
  return PALETA_DONUT[index % PALETA_DONUT.length]
}
