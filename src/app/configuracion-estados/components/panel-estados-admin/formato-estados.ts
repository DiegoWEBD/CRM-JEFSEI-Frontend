/**
 * Convierte una probabilidad de cierre (0..1) a texto en porcentaje.
 * Ej: 0.7 -> '70%'
 */
export function formatearProbabilidad(probabilidad: number): string {
	const porcentaje = Math.round(probabilidad * 100)
	return `${porcentaje}%`
}

/**
 * Convierte los días límite a texto legible. `null` significa sin límite.
 */
export function formatearDiasLimite(diasLimite: number | null): string {
	if (diasLimite === null || diasLimite === undefined) return 'Sin límite'
	return `${diasLimite} ${diasLimite === 1 ? 'día' : 'días'}`
}
