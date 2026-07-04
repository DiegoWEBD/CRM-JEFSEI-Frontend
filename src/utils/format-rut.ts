export function formatRut(value: string): string {
	const clean = value.replace(/[^0-9kK]/g, '').toUpperCase()
	if (clean.length <= 1) return clean
	const dv = clean.slice(-1)
	const body = clean.slice(0, -1)
	const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
	return `${formatted}-${dv}`
}
