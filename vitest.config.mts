import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const src = fileURLToPath(new URL('./src', import.meta.url))

/**
 * Configuración de tests del frontend.
 *
 * Decisiones:
 * - `jsdom` por defecto: la mayoría de tests son de componentes/formularios.
 *   Los tests de route handlers y de `proxy.ts` declaran `// @vitest-environment node`
 *   en su propio archivo, porque usan Request/Response sin DOM.
 * - Sin umbral global de cobertura: el informe se usa como herramienta diagnóstica
 *   para localizar lógica crítica sin probar, no como objetivo numérico.
 * - Los tests nunca tocan red: las dependencias HTTP se sustituyen en el límite del
 *   sistema (adaptadores de axios, `fetch`, `next/headers`), nunca mockeando la
 *   función que se está verificando.
 */
export default defineConfig({
	resolve: {
		alias: { '@': src },
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		include: ['src/**/*.test.{ts,tsx}'],
		clearMocks: true,
		restoreMocks: true,
		unstubGlobals: true,
		testTimeout: 15_000,
		// URLs sintéticas: ningún servicio real se alcanza desde los tests.
		env: {
			API_URL: 'http://backend.test',
			APP_URL: 'http://crm.test',
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'json-summary'],
			reportsDirectory: './coverage',
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'**/*.d.ts',
				'**/types/**',
				'**/*.test.{ts,tsx}',
				'**/__tests__/**',
				'src/app/**/page.tsx',
				'src/app/**/layout.tsx',
				'src/app/**/template.tsx',
				'src/app/globals.css',
			],
			thresholds: {
				// Sin umbral global arbitrario (ver spec §9). Sí se protege la lógica
				// de autorización/sesión, que es donde una rama sin cubrir duele.
				'src/lib/auth.ts': { statements: 80, branches: 70 },
				'src/lib/refresh-tokens.ts': { statements: 80, branches: 70 },
				'utils/axios/normalizar-error-servidor.ts': { statements: 90, branches: 80 },
			},
		},
	},
})
