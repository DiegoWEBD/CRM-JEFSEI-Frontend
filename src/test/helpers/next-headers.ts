/**
 * Mock controlable de `next/headers`.
 *
 * El estado vive en un objeto de módulo normal (sin `vi.hoisted`, que no puede
 * exportarse). Cada test lo instala con:
 *
 *   vi.mock('next/headers', async () => {
 *     const { mockNextHeadersImpl } = await import('@/test/helpers/next-headers')
 *     return mockNextHeadersImpl
 *   })
 *
 * La importación dinámica dentro del factory garantiza que este módulo se evalúa
 * antes de usarse y que todos los archivos de test compartan el mismo estado.
 *
 * Es una frontera del sistema: se sustituye el acceso al request entrante, no la
 * lógica que se está verificando.
 */
export const estadoNextHeaders = {
	cookies: new Map<string, string>(),
	cabeceras: new Map<string, string>(),
}

type CookieMock = { name: string; value: string }

function crearCookieStore() {
	return {
		get(nombre: string): CookieMock | undefined {
			const value = estadoNextHeaders.cookies.get(nombre)
			return value === undefined ? undefined : { name: nombre, value }
		},
		has(nombre: string): boolean {
			return estadoNextHeaders.cookies.has(nombre)
		},
		getAll(): CookieMock[] {
			return [...estadoNextHeaders.cookies.entries()].map(([name, value]) => ({
				name,
				value,
			}))
		},
		set(nombre: string, value: string): void {
			estadoNextHeaders.cookies.set(nombre, value)
		},
		delete(nombre: string): void {
			estadoNextHeaders.cookies.delete(nombre)
		},
		toString(): string {
			return [...estadoNextHeaders.cookies.entries()]
				.map(([name, value]) => `${name}=${value}`)
				.join('; ')
		},
	}
}

/** Implementación que se devuelve desde el factory de `vi.mock('next/headers')`. */
export const mockNextHeadersImpl = {
	cookies: async () => crearCookieStore(),
	headers: async () => new Headers(Object.fromEntries(estadoNextHeaders.cabeceras)),
}

/** Fija cookies del request entrante (p. ej. `token` / `refresh_token`). */
export function fijarCookies(cookies: Record<string, string>): void {
	for (const [nombre, valor] of Object.entries(cookies)) {
		estadoNextHeaders.cookies.set(nombre, valor)
	}
}

/** Fija cabeceras del request entrante (p. ej. `x-forwarded-for`). */
export function fijarCabeceras(cabeceras: Record<string, string>): void {
	for (const [nombre, valor] of Object.entries(cabeceras)) {
		estadoNextHeaders.cabeceras.set(nombre.toLowerCase(), valor)
	}
}

/** Limpia el estado entre pruebas. */
export function limpiarNextHeaders(): void {
	estadoNextHeaders.cookies.clear()
	estadoNextHeaders.cabeceras.clear()
}
