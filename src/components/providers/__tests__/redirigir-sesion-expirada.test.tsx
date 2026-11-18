import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }))

vi.mock('next/navigation', () => ({
	useRouter: () => router,
}))

import RedirigirSesionExpirada from '../redirigir-sesion-expirada'

describe('RedirigirSesionExpirada', () => {
	beforeEach(() => {
		window.history.replaceState({}, '', '/prospectos?estado=nuevo')
	})

	it('al expirar la sesión redirige a /login conservando la ruta actual', async () => {
		render(<RedirigirSesionExpirada />)

		await act(async () => {
			window.dispatchEvent(new Event('session-expired'))
		})

		expect(router.replace).toHaveBeenCalledWith(
			'/login?next=%2Fprospectos%3Festado%3Dnuevo',
		)
	})

	it('no redirige si ya estamos en /login (evita bucles)', async () => {
		window.history.replaceState({}, '', '/login')
		render(<RedirigirSesionExpirada />)

		await act(async () => {
			window.dispatchEvent(new Event('session-expired'))
		})

		expect(router.replace).not.toHaveBeenCalled()
	})

	it('deja de escuchar al desmontarse', async () => {
		const { unmount } = render(<RedirigirSesionExpirada />)
		unmount()

		await act(async () => {
			window.dispatchEvent(new Event('session-expired'))
		})

		expect(router.replace).not.toHaveBeenCalled()
	})
})
