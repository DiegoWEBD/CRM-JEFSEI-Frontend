import axios from 'axios'

export class UnauthorizedError extends Error {
	constructor(mensaje = 'No tienes permiso para acceder a este recurso.') {
		super(mensaje)
		this.name = 'UnauthorizedError'
	}
}

/**
 * Digest con el que se marcan los errores HTTP 403 (sin permisos).
 *
 * En un render de servidor, Next serializa el error hacia `error.tsx` y en
 * producción solo sobrevive `digest` (el `message` se redacta). Next respeta un
 * digest ya presente en el error, así que marcarlo aquí es lo que permite
 * reconocer el 403 aunque el error cruce la serialización Server → Client.
 */
export const DIGEST_SIN_PERMISOS = 'SIN_PERMISOS'

/** Estampa el digest de "sin permisos" sobre un error 403, sin reemplazarlo. */
export function marcarErrorSinPermisos<TError extends object>(
	error: TError,
): TError & { digest: string } {
	return Object.assign(error, { digest: DIGEST_SIN_PERMISOS })
}

/**
 * Detecta errores de "sin permisos" (HTTP 403):
 * - los marcados con `DIGEST_SIN_PERMISOS` (incluye los serializados en SSR);
 * - errores de axios con status 403 lanzados en el cliente, que llegan completos.
 */
export function esErrorSinPermisos(error: unknown): boolean {
	if (typeof error !== 'object' || error === null) return false
	if ((error as { digest?: unknown }).digest === DIGEST_SIN_PERMISOS) return true
	return axios.isAxiosError(error) && error.response?.status === 403
}
