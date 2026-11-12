import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useIsMobile } from '../use-mobile'

const MOBILE = 375
const DESKTOP = 1280

type Listener = () => void

/**
 * Mock de matchMedia controlable: el shim de vitest.setup.ts no emite eventos
 * 'change', y aquí necesitamos simular redimensiones de la ventana.
 */
function mockViewport(initialWidth: number) {
	const listeners = new Set<Listener>()

	const setWidth = (value: number) =>
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value,
		})

	setWidth(initialWidth)
	window.matchMedia = ((query: string) => ({
		media: query,
		get matches() {
			return window.innerWidth < 1024
		},
		onchange: null,
		addEventListener: (_type: string, cb: Listener) => void listeners.add(cb),
		removeEventListener: (_type: string, cb: Listener) => void listeners.delete(cb),
		addListener: (cb: Listener) => void listeners.add(cb),
		removeListener: (cb: Listener) => void listeners.delete(cb),
		dispatchEvent: () => false,
	})) as unknown as typeof window.matchMedia

	return {
		resizeTo(next: number) {
			setWidth(next)
			act(() => {
				listeners.forEach(cb => cb())
			})
		},
	}
}

/**
 * Regresión: el hook calculaba el valor solo al cruzar la media query (evento
 * 'change'), nunca al montar. En la primera carga a viewport mobile quedaba en
 * false y el botón del header alternaba el estado desktop del sidebar (invisible)
 * en vez de abrir el drawer.
 */
describe('useIsMobile — detección de viewport', () => {
	it('devuelve true desde el primer render en viewport mobile', () => {
		mockViewport(MOBILE)

		const { result } = renderHook(() => useIsMobile())

		expect(result.current).toBe(true)
	})

	it('devuelve false desde el primer render en viewport desktop', () => {
		mockViewport(DESKTOP)

		const { result } = renderHook(() => useIsMobile())

		expect(result.current).toBe(false)
	})

	it('reacciona al redimensionar cruzando el breakpoint', () => {
		const vp = mockViewport(MOBILE)
		const { result } = renderHook(() => useIsMobile())
		expect(result.current).toBe(true)

		vp.resizeTo(DESKTOP)
		expect(result.current).toBe(false)

		vp.resizeTo(MOBILE)
		expect(result.current).toBe(true)
	})
})
