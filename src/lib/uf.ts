export const UF_VALUE = 39_100

export function toSafeNumber(value: unknown): number {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

export function pesosToUf(pesos: number): number {
  const safe = toSafeNumber(pesos)
  if (safe <= 0) return 0
  return Math.round((safe / UF_VALUE) * 100) / 100
}

export function formatUfAmount(uf: number): string {
  const safe = toSafeNumber(uf)
  const rounded = Math.round(safe * 100) / 100
  const [intPart, decPart] = rounded.toFixed(2).split(".")
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${intFormatted},${decPart} UF`
}

export function formatUF(valueInPesos: unknown): string {
  return formatUfAmount(pesosToUf(toSafeNumber(valueInPesos)))
}

export function pesosToUfChart(pesos: unknown): number {
  return pesosToUf(toSafeNumber(pesos))
}

export function chartAxisTickUf(uf: unknown): string {
  return formatUfAmount(toSafeNumber(uf))
}
