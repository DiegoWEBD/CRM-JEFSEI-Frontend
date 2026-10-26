import { act, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { vi } from 'vitest'

import { AuthProvider } from '@/contexts/auth-context'
import type { TokenPayload } from '@/dtos/token-payload'

/**
 * Renderiza un árbol dentro de un `AuthProvider` real.
 *
 * `AuthProvider` consulta `/api/auth/get-session` al montar, así que se
 * sustituye `fetch` (frontera de red) para devolver la sesión indicada. La
 * lógica de permisos que se verifica es la real del contexto.
 */
export async function renderConSesion(
	payload: TokenPayload | null,
	ui: ReactNode,
): Promise<ReturnType<typeof render>> {
	vi.stubGlobal(
		'fetch',
		vi.fn(async () =>
			payload === null
				? new Response(JSON.stringify({ error: 'Usuario no autenticado' }), {
						status: 401,
					})
				: new Response(JSON.stringify(payload), {
						status: 200,
						headers: { 'content-type': 'application/json' },
					}),
		),
	)

	const utils = render(<AuthProvider initialPayload={payload}>{ui}</AuthProvider>)
	// Vacía la promesa de obtenerSesion() antes de asertar.
	await act(async () => {})
	return utils
}
