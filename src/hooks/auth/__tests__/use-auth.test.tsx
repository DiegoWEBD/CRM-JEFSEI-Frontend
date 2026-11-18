import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }))

vi.mock('next/navigation', () => ({
	useRouter: () => router,
}))

import axios from 'axios'
import { AuthProvider } from '@/contexts/auth-context'
import { useAuth } from '@/hooks/auth/use-auth'
import { clientAxios } from '@/infraestructura/axios/client-axios'
import { simularFetch } from '@/test/helpers/fetch-simulado'
import { simularRed, type RedSimulada } from '@/test/helpers/red-simulada'

let red: RedSimulada

function renderUseAuth() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	})

	function wrapper({ children }: { children: ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>
				<AuthProvider initialPayload={null}>{children}</AuthProvider>
			</QueryClientProvider>
		)
	}

	return renderHook(() => useAuth(), { wrapper })
}

beforeEach(() => {
	// El AuthProvider revalida la sesión al montar: sin sesión en el servidor.
	simularFetch(() => ({ status: 401, json: {} }))
	red = simularRed(() => ({ status: 200, data: {} }), [axios, clientAxios])
})

describe('useAuth — destino tras el login', () => {
	it('vuelve a la ruta que se intentaba visitar (?next=)', async () => {
		window.history.replaceState({}, '', '/login?next=%2Fpolizas')
		const { result } = renderUseAuth()

		await act(async () => {
			await result.current.login('123456785', 'clave-de-prueba')
		})

		expect(red.llamadas).toHaveLength(1)
		expect(router.replace).toHaveBeenCalledWith('/polizas')
	})

	it('conserva la query del destino', async () => {
		window.history.replaceState({}, '', '/login?next=%2Fprospectos%3Festado%3Dnuevo')
		const { result } = renderUseAuth()

		await act(async () => {
			await result.current.login('123456785', 'clave-de-prueba')
		})

		expect(router.replace).toHaveBeenCalledWith('/prospectos?estado=nuevo')
	})

	it('sin ?next= va al home', async () => {
		window.history.replaceState({}, '', '/login')
		const { result } = renderUseAuth()

		await act(async () => {
			await result.current.login('123456785', 'clave-de-prueba')
		})

		expect(router.replace).toHaveBeenCalledWith('/')
	})

	it('descarta un ?next= externo (open redirect) y va al home', async () => {
		window.history.replaceState(
			{},
			'',
			'/login?next=https%3A%2F%2Fevil.example%2Frobar',
		)
		const { result } = renderUseAuth()

		await act(async () => {
			await result.current.login('123456785', 'clave-de-prueba')
		})

		expect(router.replace).toHaveBeenCalledWith('/')
	})
})

describe('useAuth — logout', () => {
	it('al cerrar sesión vuelve a /login', async () => {
		const { result } = renderUseAuth()

		await act(async () => {
			await result.current.logout()
		})

		expect(router.replace).toHaveBeenCalledWith('/login')
	})
})
