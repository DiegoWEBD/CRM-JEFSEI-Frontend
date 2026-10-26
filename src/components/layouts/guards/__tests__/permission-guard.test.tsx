import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import PermissionGuard from '../permission-guard'
import { payloadSesion } from '@/test/fixtures/sesion'
import { renderConSesion } from '@/test/helpers/render-con-sesion'

const CONTENIDO = 'Botón de eliminar solicitud'

function guardia(props: {
	allowedPermissions: string[]
	requireAll?: boolean
	fallback?: string
}) {
	return (
		<PermissionGuard
			allowedPermissions={props.allowedPermissions}
			requireAll={props.requireAll}
			fallback={props.fallback ?? 'Acceso restringido'}
		>
			<button>{CONTENIDO}</button>
		</PermissionGuard>
	)
}

describe('PermissionGuard — visibilidad de acciones por permiso', () => {
	it('muestra la acción cuando el usuario tiene el permiso', async () => {
		await renderConSesion(
			payloadSesion({ codigo_permisos: ['ELIMINAR_SOLICITUD_COTIZACION'] }),
			guardia({ allowedPermissions: ['ELIMINAR_SOLICITUD_COTIZACION'] }),
		)

		expect(screen.getByRole('button', { name: CONTENIDO })).toBeInTheDocument()
		expect(screen.queryByText('Acceso restringido')).toBeNull()
	})

	it('oculta la acción y muestra el fallback cuando el permiso no está en la sesión', async () => {
		await renderConSesion(
			payloadSesion({ codigo_permisos: ['REGISTRAR_PROSPECTO'] }),
			guardia({ allowedPermissions: ['ELIMINAR_SOLICITUD_COTIZACION'] }),
		)

		expect(screen.queryByRole('button', { name: CONTENIDO })).toBeNull()
		expect(screen.getByText('Acceso restringido')).toBeInTheDocument()
	})

	it('no ofrece ninguna acción protegida cuando no hay sesión', async () => {
		await renderConSesion(
			null,
			guardia({ allowedPermissions: ['ELIMINAR_SOLICITUD_COTIZACION'] }),
		)

		expect(screen.queryByRole('button', { name: CONTENIDO })).toBeNull()
		expect(screen.getByText('Acceso restringido')).toBeInTheDocument()
	})

	it('con varios permisos admitidos basta con tener uno (OR por defecto)', async () => {
		await renderConSesion(
			payloadSesion({ codigo_permisos: ['ACTUALIZAR_COTIZACION'] }),
			guardia({
				allowedPermissions: ['ACTUALIZAR_COTIZACION', 'ELIMINAR_COTIZACION'],
			}),
		)

		expect(screen.getByRole('button', { name: CONTENIDO })).toBeInTheDocument()
	})

	it('con requireAll exige la totalidad de los permisos', async () => {
		await renderConSesion(
			payloadSesion({ codigo_permisos: ['ACTUALIZAR_COTIZACION'] }),
			guardia({
				allowedPermissions: ['ACTUALIZAR_COTIZACION', 'ELIMINAR_COTIZACION'],
				requireAll: true,
			}),
		)

		expect(screen.queryByRole('button', { name: CONTENIDO })).toBeNull()
		expect(screen.getByText('Acceso restringido')).toBeInTheDocument()
	})

	it('con requireAll y todos los permisos muestra la acción', async () => {
		await renderConSesion(
			payloadSesion({
				codigo_permisos: ['ACTUALIZAR_COTIZACION', 'ELIMINAR_COTIZACION'],
			}),
			guardia({
				allowedPermissions: ['ACTUALIZAR_COTIZACION', 'ELIMINAR_COTIZACION'],
				requireAll: true,
			}),
		)

		expect(screen.getByRole('button', { name: CONTENIDO })).toBeInTheDocument()
	})

	it('sin lista de permisos no restringe el contenido', async () => {
		await renderConSesion(
			payloadSesion({ codigo_permisos: [] }),
			guardia({ allowedPermissions: [] }),
		)

		expect(screen.getByRole('button', { name: CONTENIDO })).toBeInTheDocument()
	})
})
