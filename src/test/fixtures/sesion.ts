import type { TokenPayload } from '@/dtos/token-payload'

/**
 * Fixtures de sesión. Todos los valores son sintéticos: ningún RUT, nombre ni
 * secreto real. Los JWT se construyen sin firma válida porque el código de
 * producción solo decodifica el payload (no verifica firma): eso es exactamente
 * lo que se está comprobando.
 */

const AHORA = Math.floor(Date.now() / 1000)

/** Cuerpos de RUT sintéticos de 8 dígitos, sin correspondencia con personas reales. */
export const RUTS_SINTETICOS = {
	ejecutivoComercial: '11.111.111-1',
	ejecutivoEvaluacion: '22.222.222-2',
	gerenteGeneral: '33.333.333-3',
	ejecutivoCobranza: '44.444.444-4',
} as const

export type SesionOverrides = Partial<TokenPayload> & {
	/** Segundos desde ahora. Negativo = token ya vencido. */
	enSegundos?: number
}

export function payloadSesion(overrides: SesionOverrides = {}): TokenPayload {
	const { enSegundos = 3600, ...resto } = overrides
	const base: TokenPayload = {
		rut: '11.111.111-1',
		nombre: 'Usuario de Prueba',
		exp: AHORA + enSegundos,
		sid: 'sesion-sintetica-001',
		jti: 'jti-sintetico-001',
		codigo_roles: ['EJECUTIVO_COMERCIAL'],
		nombre_roles: ['Ejecutivo Comercial'],
		codigo_permisos: ['REGISTRAR_PROSPECTO', 'ADMINISTRAR_PROCESOS_COMERCIALES_PROPIOS'],
		...resto,
	}
	return base
}

/** Codifica un payload como JWT sin firma válida (el código de producción no la verifica). */
export function codificarJwt(payload: TokenPayload): string {
	const encabezado = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64')
	const cuerpo = Buffer.from(JSON.stringify(payload)).toString('base64')
	return `${encabezado}.${cuerpo}.firma-sintetica`
}

/** JWT listo para usar como cookie `token`. */
export function tokenSesion(overrides: SesionOverrides = {}): string {
	return codificarJwt(payloadSesion(overrides))
}

/** Cadena que parece JWT pero cuyo payload no es JSON parseable. */
export const TOKEN_MALFORMADO = 'no-es-un.jwt-valido.aqui'

/** Construye un `File` sintético con el tamaño indicado (en bytes). */
export function archivoSintetico(tamanoBytes: number, nombre = 'evidencia.pdf'): File {
	return new File([new Uint8Array(tamanoBytes)], nombre, { type: 'application/pdf' })
}
