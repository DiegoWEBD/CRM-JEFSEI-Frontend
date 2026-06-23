export function toSafeNumber(value: unknown): number {
	const num = Number(value)
	return Number.isFinite(num) ? num : 0
}

export function formatUfAmount(uf: number): string {
	const safe = toSafeNumber(uf)
	if (safe === 0) return '0 UF'
	const [intPart, decPart] = String(safe).split('.')
	const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
	if (decPart === undefined) return `${intFormatted} UF`
	return `${intFormatted},${decPart} UF`
}

export function formatUF(value: unknown): string {
	return formatUfAmount(toSafeNumber(value))
}

export function chartAxisTickUf(uf: unknown): string {
	return formatUfAmount(toSafeNumber(uf))
}
