export const normalizarFechaTexto = (fecha: Date): string => {
	return fecha.toLocaleDateString('es-CL', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	})
}
