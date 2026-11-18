/**
 * Utilidades de rutas para los redirects de autenticación.
 *
 * El parámetro `next` de /login viaja en la URL, por lo que su valor lo
 * controla quien navega: solo se aceptan rutas internas para no convertir
 * el login en un open redirect.
 */

/** Rutas accesibles sin sesión activa. */
const RUTAS_PUBLICAS = ['/login']

export function esRutaPublica(pathname: string): boolean {
	return RUTAS_PUBLICAS.includes(pathname)
}

/**
 * Valida un destino `next` para el redirect tras el login.
 *
 * Acepta solo rutas internas (`/...`) que no sean rutas públicas (para no
 * redirigir en bucle). Devuelve `null` ante cualquier otra cosa: URLs
 * absolutas, `//host`, `/\host` o valores vacíos.
 */
export function destinoSeguro(next: string | null | undefined): string | null {
	if (!next || !next.startsWith('/') || next.startsWith('//')) return null

	const url = new URL(next, 'http://destino.invalid')
	// Un destino como `/\host` resuelve a otro origen: se descarta.
	if (url.origin !== 'http://destino.invalid') return null
	if (esRutaPublica(url.pathname)) return null

	return next
}

/**
 * URL de /login para un usuario sin sesión, conservando en `?next=` la ruta
 * que intentaba visitar para volver a ella tras autenticarse.
 */
export function urlLoginConDestino(pathname: string, search = ''): string {
	const destino = `${pathname}${search}`
	if (destino === '/' || !destinoSeguro(destino)) return '/login'
	return `/login?next=${encodeURIComponent(destino)}`
}
