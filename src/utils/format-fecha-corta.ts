export function formatFechaCorta(isoDate: string) {
	const d = new Date(`${isoDate}T12:00:00`)
	return d.toLocaleDateString('es-CL', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})
}
