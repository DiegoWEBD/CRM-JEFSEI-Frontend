import { vi } from 'vitest'

/**
 * Stub de `fetch` para los límites de red que no pasan por axios
 * (`intentarRefresh` de client-axios y `refrescarTokensEnBackend`).
 *
 * Igual que con axios: se sustituye la frontera HTTP, nunca la función bajo prueba.
 */

export type FetchSimulado = {
	llamadas: { url: string; method: string; body: unknown }[]
	restaurar(): void
}

export function simularFetch(
	responder: (url: string, init?: RequestInit) => { status: number; json?: unknown },
): FetchSimulado {
	const llamadas: FetchSimulado['llamadas'] = []
	const original = globalThis.fetch

	const stub = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
		const url =
			typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
		let body: unknown = init?.body
		if (typeof body === 'string') {
			try {
				body = JSON.parse(body)
			} catch {
				/* se deja como string */
			}
		}
		llamadas.push({ url, method: (init?.method ?? 'GET').toUpperCase(), body })
		const r = responder(url, init)
		return new Response(r.json === undefined ? null : JSON.stringify(r.json), {
			status: r.status,
			headers: { 'content-type': 'application/json' },
		}) as Response
	})

	vi.stubGlobal('fetch', stub)

	return {
		llamadas,
		restaurar() {
			vi.stubGlobal('fetch', original)
		},
	}
}
