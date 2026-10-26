import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Nav from '../nav'

vi.mock('next/navigation', () => ({
	usePathname: () => '/prospectos',
}))

const GESTION = [
	'Dashboard',
	'Oportunidades',
	'Personal',
	'Compañías de seguros',
	'Configuración de estados',
	'Productos',
	'Auditoría',
	'Sesiones',
] as const

const SOLO_GERENCIA = ['Parámetros de condominios'] as const

const EVALUACION = ['Solicitudes de cotización', 'Cotizaciones emitidas'] as const

const VISIBLES_PARA_TODOS = ['Inicio', 'Pólizas'] as const

function visibles(roles: string[]): string[] {
	render(<Nav roles={roles} />)
	return screen.getAllByRole('link').map(l => l.textContent ?? '')
}

/**
 * Matriz de visibilidad del menú lateral por rol.
 *
 * Alcance: protege que la UI no ofrezca como accesible una función que el rol no
 * tiene. No sustituye a la autorización del servidor, que es la que decide de
 * verdad con el JWT de la cookie.
 */
describe('Nav — visibilidad del menú por rol', () => {
	it('un ejecutivo comercial no ve las funciones de administración ni de gerencia', () => {
		const nombres = visibles(['EJECUTIVO_COMERCIAL'])

		expect(nombres).toEqual(
			expect.arrayContaining([...VISIBLES_PARA_TODOS, 'Prospectos', 'Administradores']),
		)
		for (const oculto of [...GESTION, ...SOLO_GERENCIA, ...EVALUACION]) {
			expect(nombres).not.toContain(oculto)
		}
	})

	it('un ejecutivo de evaluación accede a las bandejas de cotización pero no a la administración', () => {
		const nombres = visibles(['EJECUTIVO_EVALUACION_PROYECTOS'])

		for (const item of EVALUACION) expect(nombres).toContain(item)
		for (const oculto of GESTION) expect(nombres).not.toContain(oculto)
	})

	it('un ejecutivo de cobranza no accede a las bandejas de cotización ni a la administración', () => {
		const nombres = visibles(['EJECUTIVO_COBRANZA'])

		for (const oculto of [...EVALUACION, ...GESTION, ...SOLO_GERENCIA]) {
			expect(nombres).not.toContain(oculto)
		}
	})

	it('un ejecutivo de renovación tampoco accede a las bandejas de cotización', () => {
		const nombres = visibles(['EJECUTIVO_RENOVACION'])

		for (const oculto of [...EVALUACION, ...GESTION]) {
			expect(nombres).not.toContain(oculto)
		}
	})

	it('el gerente general ve la totalidad de las secciones', () => {
		const nombres = visibles(['GERENTE_GENERAL'])

		for (const item of [...GESTION, ...SOLO_GERENCIA, ...EVALUACION]) {
			expect(nombres).toContain(item)
		}
	})

	it('el gerente de operaciones administra productos y auditoría pero no parámetros de condominios', () => {
		const nombres = visibles(['GERENTE_OPERACIONES'])

		for (const item of ['Productos', 'Auditoría', 'Sesiones']) {
			expect(nombres).toContain(item)
		}
		expect(nombres).not.toContain('Parámetros de condominios')
	})

	it('el rol desarrollador tiene el mismo alcance que la gerencia', () => {
		const nombres = visibles(['DESARROLLADOR'])

		for (const item of [...GESTION, ...SOLO_GERENCIA, ...EVALUACION]) {
			expect(nombres).toContain(item)
		}
	})

	it('sin roles solo aparecen las secciones públicas del menú', () => {
		const nombres = visibles([])

		expect(nombres).toEqual([...VISIBLES_PARA_TODOS])
	})

	it('un segundo rol basta para ampliar el alcance visible', () => {
		const nombres = visibles(['EJECUTIVO_COMERCIAL', 'GERENTE_COMERCIAL'])

		expect(nombres).toContain('Configuración de estados')
		expect(nombres).toContain('Solicitudes de cotización')
	})
})
