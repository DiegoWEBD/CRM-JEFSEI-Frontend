/**
 * Convierte días decimales (fracción de día, horas calendario 24/7) a texto
 * legible: '0 días 13 h'.
 *
 * - Días y horas se redondean hacia abajo (nunca promete tiempo de más).
 * - Con horas en 0 se omite esa parte: '1 día', '10 días'.
 * - `null`/`undefined` se muestra como '—'.
 */
export function formatearDiasHoras(valor: number | null | undefined): string {
	if (valor === null || valor === undefined) return '—'

	const totalHoras = Math.floor(valor * 24)
	const dias = Math.floor(totalHoras / 24)
	const horas = totalHoras - dias * 24
	const etiquetaDias = `${dias} ${dias === 1 ? 'día' : 'días'}`

	if (horas === 0) return etiquetaDias

	return `${etiquetaDias} ${horas} h`
}
