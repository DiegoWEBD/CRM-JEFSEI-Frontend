/**
 * Validación de RUT chileno (persona jurídica / natural): 8 dígitos de cuerpo + dígito verificador (0-9 o K).
 */

/** Limpia texto copiado/pega do (espacios invisibles, guiones raros, etc.) antes de extraer dígitos. */
function rutChilenoTextoBase(rut: string): string {
	return rut
		.normalize('NFKC')
		.replace(/[\u200B-\u200D\uFEFF]/g, '')
		.replace(/[–—−]/g, '-')
		.trim()
}

function soloDigitosYCuerpoDv(rut: string): string {
	return rutChilenoTextoBase(rut)
		.replace(/[^0-9kK]/gi, '')
		.toUpperCase()
}

/** Calcula el dígito verificador para un cuerpo de exactamente 8 dígitos. */
export function rutChilenoCalcularDv(cuerpo8: string): string {
	if (!/^\d{8}$/.test(cuerpo8)) return ''
	let suma = 0
	let m = 2
	for (let i = 7; i >= 0; i--) {
		suma += parseInt(cuerpo8[i]!, 10) * m
		m = m === 7 ? 2 : m + 1
	}
	const resto = suma % 11
	const d = 11 - resto
	if (d === 11) return '0'
	if (d === 10) return 'K'
	return String(d)
}

export type EstadoValidacionRutChileno =
	| 'vacio'
	| 'incompleto'
	| 'formato_invalido'
	| 'dv_invalido'
	| 'valido'

export function rutChilenoEstadoValidacion(
	rut?: string,
): EstadoValidacionRutChileno {
	if (!rut) return 'vacio'
	const limpio = soloDigitosYCuerpoDv(rut)
	if (limpio.length === 0) return 'vacio'
	if (limpio.length < 9) return 'incompleto'
	if (limpio.length > 9) return 'formato_invalido'
	const cuerpo = limpio.slice(0, 8)
	const dvIng = limpio.slice(8, 9)
	if (!/^\d{8}$/.test(cuerpo)) return 'formato_invalido'
	if (!/^[0-9K]$/.test(dvIng)) return 'formato_invalido'
	const esperado = rutChilenoCalcularDv(cuerpo).toUpperCase()
	return esperado === dvIng ? 'valido' : 'dv_invalido'
}

export function rutChilenoEsValido(rut: string): boolean {
	return rutChilenoEstadoValidacion(rut) === 'valido'
}

/** Formato XX.XXX.XXX-Y si el valor es válido; si no, devuelve el texto recortado. */
export function rutChilenoFormatearVisual(rut: string): string {
	const base = rutChilenoTextoBase(rut)
	const limpio = soloDigitosYCuerpoDv(rut)
	if (limpio.length !== 9 || rutChilenoEstadoValidacion(rut) !== 'valido')
		return base
	const body = limpio.slice(0, 8)
	const dv = limpio.slice(8, 9)
	return `${body.slice(0, 2)}.${body.slice(2, 5)}.${body.slice(5, 8)}-${dv}`
}
