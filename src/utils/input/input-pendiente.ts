export function inputPendiente(input?: string | number | boolean) {
	if (input === undefined) return true
	if (typeof input === 'boolean' || typeof input === 'number') return false

	const pendiente = !input ? true : !String(input).trim()
	return pendiente
}
