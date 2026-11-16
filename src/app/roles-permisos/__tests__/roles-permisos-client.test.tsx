import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/roles/use-roles-con-permisos', () => ({
	useRolesConPermisos: vi.fn(),
}))
vi.mock('@/hooks/permisos/use-permisos', () => ({
	usePermisos: vi.fn(),
}))
vi.mock('@/hooks/roles/use-asignar-permisos-rol', () => ({
	useAsignarPermisosRol: vi.fn(),
}))
vi.mock('@/hooks/usuarios/use-usuarios', () => ({
	useUsuarios: vi.fn(),
}))
vi.mock('@/hooks/usuarios/use-actualizar-roles-usuario', () => ({
	useActualizarRolesUsuario: vi.fn(),
}))
vi.mock('@/hooks/roles/use-obtener-roles', () => ({
	useObtenerRoles: vi.fn(),
}))
vi.mock('@/hooks/use-debounce', () => ({
	useDebounce: (valor: string) => valor,
}))

import Usuario from '@/dominio/usuario/usuario'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { usePermisos } from '@/hooks/permisos/use-permisos'
import { useAsignarPermisosRol } from '@/hooks/roles/use-asignar-permisos-rol'
import { useObtenerRoles } from '@/hooks/roles/use-obtener-roles'
import { useRolesConPermisos } from '@/hooks/roles/use-roles-con-permisos'
import { useActualizarRolesUsuario } from '@/hooks/usuarios/use-actualizar-roles-usuario'
import { useUsuarios } from '@/hooks/usuarios/use-usuarios'
import { payloadSesion } from '@/test/fixtures/sesion'
import { renderConSesion } from '@/test/helpers/render-con-sesion'
import RolesPermisosClient from '../components/roles-permisos-client'

const useRolesConPermisosMock = vi.mocked(useRolesConPermisos)
const usePermisosMock = vi.mocked(usePermisos)
const useAsignarPermisosRolMock = vi.mocked(useAsignarPermisosRol)
const useUsuariosMock = vi.mocked(useUsuarios)
const useActualizarRolesUsuarioMock = vi.mocked(useActualizarRolesUsuario)
const useObtenerRolesMock = vi.mocked(useObtenerRoles)

const ROLES = [
	{
		codigo: 'GERENTE_GENERAL',
		nombre: 'Gerente General',
		permisos: [{ codigo: 'ADMINISTRAR_ROLES', descripcion: 'Administrar roles' }],
	},
	{
		codigo: 'EJECUTIVO_COMERCIAL',
		nombre: 'Ejecutivo Comercial',
		permisos: [{ codigo: 'VER_ALERTAS', descripcion: 'Ver alertas' }],
	},
]

const PERMISOS = [
	{ codigo: 'ADMINISTRAR_ROLES', descripcion: 'Administrar roles' },
	{ codigo: 'VER_ALERTAS', descripcion: 'Ver alertas' },
	{ codigo: 'OBTENER_ROLES', descripcion: 'Obtener roles' },
]

function usuarioFixture(): Usuario {
	return new Usuario(
		'11.111.111-1',
		'Ana Pérez',
		'ana@test.com',
		null,
		'Sucursal Principal',
		[{ codigo: 'EJECUTIVO_COMERCIAL', nombre: 'Ejecutivo Comercial' }] as never,
	)
}

function configurarMocks() {
	useRolesConPermisosMock.mockReturnValue({
		data: ROLES,
		isFetching: false,
	} as never)
	usePermisosMock.mockReturnValue({
		data: PERMISOS,
		isFetching: false,
	} as never)
	useAsignarPermisosRolMock.mockReturnValue({
		mutate: vi.fn(),
		isPending: false,
	} as never)
	useUsuariosMock.mockReturnValue({
		data: {
			data: [usuarioFixture()],
			total: 1,
			pagina: 1,
			tamano_pagina: 10,
			total_paginas: 1,
		},
		isFetching: false,
		refetch: vi.fn(),
	} as never)
	useActualizarRolesUsuarioMock.mockReturnValue({
		mutate: vi.fn(),
		isPending: false,
	} as never)
	useObtenerRolesMock.mockReturnValue({
		data: [
			{ codigo: 'GERENTE_GENERAL', nombre: 'Gerente General' },
			{ codigo: 'EJECUTIVO_COMERCIAL', nombre: 'Ejecutivo Comercial' },
		],
		isFetching: false,
	} as never)
}

const SESION_ADMIN = payloadSesion({
	codigo_roles: ['GERENTE_GENERAL'],
	nombre_roles: ['Gerente General'],
	codigo_permisos: ['ADMINISTRAR_ROLES'],
})

/** El panel real vive tras el PermissionGuard de `panel-inner.tsx`. */
function panel() {
	return (
		<PermissionGuard allowedPermissions={['ADMINISTRAR_ROLES']}>
			<RolesPermisosClient />
		</PermissionGuard>
	)
}

describe('RolesPermisosClient — panel de administración de roles y permisos', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		configurarMocks()
	})

	it('sin el permiso ADMINISTRAR_ROLES no muestra el panel', async () => {
		await renderConSesion(
			payloadSesion({ codigo_permisos: ['VER_ALERTAS'] }),
			panel(),
		)

		expect(screen.queryByText('Permisos por rol')).not.toBeInTheDocument()
		expect(screen.queryByText('Roles de usuarios')).not.toBeInTheDocument()
	})

	it('con el permiso muestra las pestañas y el checklist del primer rol', async () => {
		await renderConSesion(SESION_ADMIN, panel())

		expect(screen.getByText('Permisos por rol')).toBeInTheDocument()
		expect(screen.getByText('Roles de usuarios')).toBeInTheDocument()

		// Primer rol seleccionado por defecto: solo su permiso está marcado.
		const permisoAdmin = screen.getByRole('checkbox', {
			name: 'Permiso ADMINISTRAR_ROLES',
		})
		expect(permisoAdmin).toBeChecked()
		const permisoAlertas = screen.getByRole('checkbox', {
			name: 'Permiso VER_ALERTAS',
		})
		expect(permisoAlertas).not.toBeChecked()

		// Sin cambios, guardar está deshabilitado.
		expect(
			screen.getByRole('button', { name: /Guardar cambios/ }),
		).toBeDisabled()
	})

	it('al cambiar de rol se muestra el checklist correspondiente', async () => {
		await renderConSesion(SESION_ADMIN, panel())

		fireEvent.click(screen.getByRole('button', { name: /Ejecutivo Comercial/ }))

		expect(
			screen.getByRole('checkbox', { name: 'Permiso VER_ALERTAS' }),
		).toBeChecked()
		expect(
			screen.getByRole('checkbox', { name: 'Permiso ADMINISTRAR_ROLES' }),
		).not.toBeChecked()
	})

	it('marcar un permiso habilita guardar y la confirmación llama a la mutación', async () => {
		await renderConSesion(SESION_ADMIN, panel())

		fireEvent.click(
			screen.getByRole('checkbox', { name: 'Permiso OBTENER_ROLES' }),
		)

		const botonGuardar = screen.getByRole('button', { name: /Guardar cambios/ })
		expect(botonGuardar).toBeEnabled()
		fireEvent.click(botonGuardar)

		// ConfirmDialog
		expect(screen.getByText('Guardar permisos del rol')).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))

		await waitFor(() => {
			expect(useAsignarPermisosRolMock().mutate).toHaveBeenCalledWith(
				{
					codigoRol: 'GERENTE_GENERAL',
					codigosPermiso: ['ADMINISTRAR_ROLES', 'OBTENER_ROLES'],
				},
				expect.objectContaining({ onSuccess: expect.any(Function) }),
			)
		})
	})

	it('la pestaña de usuarios lista usuarios y abre el diálogo de roles', async () => {
		const usuario = userEvent.setup()
		await renderConSesion(SESION_ADMIN, panel())

		// Radix Tabs se activa con pointerdown, no con click sintético simple.
		await usuario.click(screen.getByRole('tab', { name: 'Roles de usuarios' }))

		// El layout mobile y el desktop comparten datos: ambos están en el DOM.
		expect(screen.getAllByText('Ana Pérez').length).toBeGreaterThan(0)
		expect(screen.getByText('Mostrando 1 de 1 usuarios')).toBeInTheDocument()

		fireEvent.click(screen.getAllByRole('button', { name: /Asignar roles/ })[0])

		const dialogo = screen.getByRole('dialog')
		expect(
			within(dialogo).getByText(/Selecciona los roles de/),
		).toBeInTheDocument()
		expect(within(dialogo).getByText('Guardar roles')).toBeInTheDocument()
	})
})
