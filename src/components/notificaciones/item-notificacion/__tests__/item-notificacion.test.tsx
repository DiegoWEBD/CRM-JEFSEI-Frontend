import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/link', () => ({
	default: ({
		href,
		children,
		...props
	}: {
		href: string
		children: React.ReactNode
	} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}))

import type { Notificacion } from '@/types/notificaciones/notificacion'
import ItemNotificacion from '../item-notificacion'

const NOTIFICACION_RENOVACION: Notificacion = {
	id: 1,
	rut_usuario: '11111111-1',
	codigo_tipo: 'RENOVACION_GESTION_PENDIENTE',
	nivel: 'AVISO',
	titulo: 'Gestionar renovación',
	mensaje: 'Debe gestionar la renovación de la póliza',
	entidad_tipo: null,
	entidad_id: null,
	id_prospecto: 7,
	numero_poliza: 'POL-001',
	dedupe_key: 'RENOVACION_GESTION_PENDIENTE:POL-001',
	leida: false,
	fecha_leida: null,
	created_at: '2026-10-07T12:00:00+00:00',
	leible: false,
}

function renderNotificacion(notificacion: Notificacion) {
	render(
		<ItemNotificacion
			notificacion={notificacion}
			onSeleccionar={vi.fn()}
		/>,
	)
	return screen.getByRole('link')
}

describe('ItemNotificacion', () => {
	it('navega a la página de la póliza cuando la notificación solo tiene póliza', () => {
		const enlace = renderNotificacion({
			...NOTIFICACION_RENOVACION,
			id_prospecto: null,
		})

		expect(enlace.getAttribute('href')).toBe('/polizas/POL-001')
	})

	it('prefiere la póliza sobre el prospecto cuando tiene ambas', () => {
		const enlace = renderNotificacion({
			...NOTIFICACION_RENOVACION,
			id_prospecto: 7,
			numero_poliza: 'POL-001',
		})

		expect(enlace.getAttribute('href')).toBe('/polizas/POL-001')
	})

	it('navega al prospecto cuando la notificación no tiene póliza', () => {
		const enlace = renderNotificacion({
			...NOTIFICACION_RENOVACION,
			codigo_tipo: 'ASIGNACION_EJECUTIVO',
			numero_poliza: null,
		})

		expect(enlace.getAttribute('href')).toBe('/prospectos/7')
	})
})
