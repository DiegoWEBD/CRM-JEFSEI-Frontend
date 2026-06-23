export function inputPendiente(input?: string | number | boolean | null) {
	if (input === undefined || input === null) return true
	if (typeof input === 'boolean' || typeof input === 'number') return false

	const pendiente = !input ? true : !String(input).trim()
	return pendiente
}
