import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// jsdom no implementa matchMedia, que usan los hooks de layout (useIsMobile).
// Es un shim del entorno, no una sustitución de lógica bajo prueba.
if (typeof window !== 'undefined' && !window.matchMedia) {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => false,
		}),
	})
}

// Shims mínimos que Radix UI necesita en jsdom (menús, popovers, tooltips).
const globals = globalThis as unknown as Record<string, unknown>

if (typeof window !== 'undefined') {
	if (!window.HTMLElement.prototype.hasPointerCapture) {
		window.HTMLElement.prototype.hasPointerCapture = () => false
	}
	if (!window.HTMLElement.prototype.releasePointerCapture) {
		window.HTMLElement.prototype.releasePointerCapture = () => {}
	}
	if (!window.HTMLElement.prototype.scrollIntoView) {
		window.HTMLElement.prototype.scrollIntoView = () => {}
	}
	if (!globals.ResizeObserver) {
		globals.ResizeObserver = class {
			observe() {}
			unobserve() {}
			disconnect() {}
		}
	}
}

afterEach(() => {
	cleanup()
	vi.useRealTimers()
})
