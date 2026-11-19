import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/usuarios/use-usuario', () => ({
	useUsuario: vi.fn(),
}))
vi.mock('@/hooks/usuarios/use-actualizar-perfil', () => ({
	useActualizarPerfil: vi.fn(),
}))
vi.mock('@/hooks/usuarios/use-cambiar-password', () => ({
	useCambiarPassword: vi.fn(),
}))

import PerfilClient from '@/app/perfil/components/perfil-client'
import Usuario from '@/dominio/usuario/usuario'
import { useActualizarPerfil } from '@/hooks/usuarios/use-actualizar-perfil'
import { useCambiarPassword } from '@/hooks/usuarios/use-cambiar-password'
import { useUsuario } from '@/hooks/usuarios/use-usuario'
import { renderConSesion } from '@/test/helpers/render-con-sesion'
import { payloadSesion } from '@/test/fixtures/sesion'

const useUsuarioMock = vi.mocked(useUsuario)
const useActualizarPerfilMock = vi.mocked(useActualizarPerfil)
const useCambiarPasswordMock = vi.mocked(useCambiarPassword)

const RUT = '11.111.111-1'

function usuarioFixture(): Usuario {
	return new Usuario(
		RUT,
		'Ana Pérez',
		'ana@test.com',
		'+56912345678',
		'Sucursal Principal',
		[{ codigo: 'EJECUTIVO_COMERCIAL', nombre: 'Ejecutivo Comercial' }] as never,
		100,
		0.05,
		'2026-01-15T00:00:00',
	)
}

function configurarMocks() {
	useUsuarioMock.mockReturnValue({
		data: usuarioFixture(),
		isFetching: false,
	} as never)
	useActualizarPerfilMock.mockReturnValue({
		mutateAsync: vi.fn().mockResolvedValue({}),
		isPending: false,
	} as never)
	useCambiarPasswordMock.mockReturnValue({
		mutateAsync: vi.fn().mockResolvedValue({}),
		isPending: false,
	} as never)
}

async function renderPerfil() {
	return renderConSesion(
		payloadSesion({ rut: RUT, nombre: 'Ana Pérez' }),
		<PerfilClient rut={RUT} />,
	)
}

async function abrirDialogoPassword(
	user: ReturnType<typeof userEvent.setup>,
) {
	await user.click(screen.getByRole('button', { name: 'Cambiar contraseña' }))
	return screen.getByRole('dialog')
}

beforeEach(() => {
	vi.clearAllMocks()
	configurarMocks()
})

describe('PerfilClient — datos del usuario', () => {
	it('muestra la ficha con los datos en solo lectura', async () => {
		await renderPerfil()

		expect(screen.getByRole('heading', { name: 'Ana Pérez' })).toBeInTheDocument()
		// El RUT aparece en el encabezado y en el campo en solo lectura
		expect(screen.getAllByText(RUT)).toHaveLength(2)
		expect(screen.getByText('ana@test.com')).toBeInTheDocument()
		expect(screen.getByText('+56912345678')).toBeInTheDocument()
		expect(screen.getByText('Sucursal Principal')).toBeInTheDocument()
		expect(screen.getByText('Ejecutivo Comercial')).toBeInTheDocument()
		expect(screen.getByText('100 UF')).toBeInTheDocument()
		expect(screen.getByText('5.00%')).toBeInTheDocument()
	})

	it('muestra el nombre en solo lectura con el botón Editar', async () => {
		await renderPerfil()

		expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
		// El nombre no es un input hasta entrar en modo edición
		expect(screen.queryByDisplayValue('Ana Pérez')).not.toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'Guardar cambios' })).toBeNull()
	})

	it('muestra el botón de cambiar contraseña y el diálogo con los 3 campos', async () => {
		const user = userEvent.setup()
		await renderPerfil()

		expect(
			screen.getByRole('button', { name: 'Cambiar contraseña' }),
		).toBeInTheDocument()
		expect(screen.queryByText('Contraseña actual')).not.toBeInTheDocument()

		const dialog = await abrirDialogoPassword(user)

		expect(within(dialog).getByText('Contraseña actual')).toBeInTheDocument()
		expect(within(dialog).getByText('Nueva contraseña')).toBeInTheDocument()
		expect(within(dialog).getByText('Confirmar contraseña')).toBeInTheDocument()
	})

	it('muestra el skeleton mientras carga el perfil', async () => {
		useUsuarioMock.mockReturnValue({
			data: undefined,
			isFetching: true,
		} as never)

		await renderPerfil()

		expect(screen.queryByText('Mis datos')).not.toBeInTheDocument()
	})
})

describe('PerfilClient — actualizar nombre', () => {
	it('envía el nombre actualizado', async () => {
		const user = userEvent.setup()
		await renderPerfil()

		await user.click(screen.getByRole('button', { name: 'Editar' }))
		const inputNombre = screen.getByDisplayValue('Ana Pérez')
		await user.clear(inputNombre)
		await user.type(inputNombre, 'Ana Pérez Rojas')
		await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

		await waitFor(() => {
			expect(useActualizarPerfilMock().mutateAsync).toHaveBeenCalledWith({
				rut: RUT,
				request: { nombre: 'Ana Pérez Rojas' },
			})
		})
	})

	it('rechaza un nombre vacío sin llamar a la mutación', async () => {
		const user = userEvent.setup()
		await renderPerfil()

		await user.click(screen.getByRole('button', { name: 'Editar' }))
		const inputNombre = screen.getByDisplayValue('Ana Pérez')
		await user.clear(inputNombre)
		await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

		expect(
			await screen.findByText('El nombre es obligatorio'),
		).toBeInTheDocument()
		expect(useActualizarPerfilMock().mutateAsync).not.toHaveBeenCalled()
	})

	it('desactiva Guardar cambios mientras el nombre sea igual al original', async () => {
		const user = userEvent.setup()
		await renderPerfil()

		await user.click(screen.getByRole('button', { name: 'Editar' }))
		// Sin cambios: visible pero deshabilitado
		expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeDisabled()

		const inputNombre = screen.getByDisplayValue('Ana Pérez')
		await user.clear(inputNombre)
		await user.type(inputNombre, 'Ana')
		expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeEnabled()

		// Vuelve al valor original: se desactiva de nuevo
		await user.clear(inputNombre)
		await user.type(inputNombre, 'Ana Pérez')
		expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeDisabled()
		expect(useActualizarPerfilMock().mutateAsync).not.toHaveBeenCalled()
	})

	it('Cancelar cierra la edición sin guardar', async () => {
		const user = userEvent.setup()
		await renderPerfil()

		await user.click(screen.getByRole('button', { name: 'Editar' }))
		const inputNombre = screen.getByDisplayValue('Ana Pérez')
		await user.clear(inputNombre)
		await user.type(inputNombre, 'Otro Nombre')
		await user.click(screen.getByRole('button', { name: 'Cancelar' }))

		expect(useActualizarPerfilMock().mutateAsync).not.toHaveBeenCalled()
		expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
		expect(
			screen.queryByDisplayValue('Otro Nombre'),
		).not.toBeInTheDocument()
	})
})

describe('PerfilClient — cambiar contraseña', () => {
	it('envía la contraseña actual y la nueva y cierra el diálogo', async () => {
		const user = userEvent.setup()
		await renderPerfil()

		const dialog = await abrirDialogoPassword(user)
		const inputs = within(dialog).getAllByPlaceholderText('••••••••')
		await user.type(inputs[0], 'PasswordActual1')
		await user.type(inputs[1], 'PasswordNueva1')
		await user.type(inputs[2], 'PasswordNueva1')
		await user.click(
			within(dialog).getByRole('button', { name: 'Cambiar contraseña' }),
		)

		await waitFor(() => {
			expect(useCambiarPasswordMock().mutateAsync).toHaveBeenCalledWith({
				rut: RUT,
				request: {
					password_actual: 'PasswordActual1',
					password_nueva: 'PasswordNueva1',
				},
			})
		})
		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		})
	})

	it('muestra error cuando las contraseñas no coinciden', async () => {
		const user = userEvent.setup()
		await renderPerfil()

		const dialog = await abrirDialogoPassword(user)
		const inputs = within(dialog).getAllByPlaceholderText('••••••••')
		await user.type(inputs[0], 'PasswordActual1')
		await user.type(inputs[1], 'PasswordNueva1')
		await user.type(inputs[2], 'DistintaPassword1')
		await user.click(
			within(dialog).getByRole('button', { name: 'Cambiar contraseña' }),
		)

		expect(
			await screen.findByText('Las contraseñas no coinciden'),
		).toBeInTheDocument()
		expect(useCambiarPasswordMock().mutateAsync).not.toHaveBeenCalled()
	})

	it('aplica la política de fortaleza a la contraseña nueva', async () => {
		const user = userEvent.setup()
		await renderPerfil()

		const dialog = await abrirDialogoPassword(user)
		const inputs = within(dialog).getAllByPlaceholderText('••••••••')
		await user.type(inputs[0], 'PasswordActual1')
		await user.type(inputs[1], 'corta')
		await user.type(inputs[2], 'corta')
		await user.click(
			within(dialog).getByRole('button', { name: 'Cambiar contraseña' }),
		)

		expect(
			await screen.findByText('La contraseña debe tener al menos 12 caracteres'),
		).toBeInTheDocument()
		expect(useCambiarPasswordMock().mutateAsync).not.toHaveBeenCalled()
	})

	it('exige la contraseña actual', async () => {
		const user = userEvent.setup()
		await renderPerfil()

		const dialog = await abrirDialogoPassword(user)
		const inputs = within(dialog).getAllByPlaceholderText('••••••••')
		await user.type(inputs[1], 'PasswordNueva1')
		await user.type(inputs[2], 'PasswordNueva1')
		await user.click(
			within(dialog).getByRole('button', { name: 'Cambiar contraseña' }),
		)

		expect(
			await screen.findByText('La contraseña actual es obligatoria'),
		).toBeInTheDocument()
		expect(useCambiarPasswordMock().mutateAsync).not.toHaveBeenCalled()
	})

	it('Cancelar cierra el diálogo sin mutar', async () => {
		const user = userEvent.setup()
		await renderPerfil()

		const dialog = await abrirDialogoPassword(user)
		const inputs = within(dialog).getAllByPlaceholderText('••••••••')
		await user.type(inputs[0], 'PasswordActual1')
		await user.click(within(dialog).getByRole('button', { name: 'Cancelar' }))

		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		})
		expect(useCambiarPasswordMock().mutateAsync).not.toHaveBeenCalled()
	})

	it('limpia los campos al reabrir el diálogo', async () => {
		const user = userEvent.setup()
		await renderPerfil()

		const dialog = await abrirDialogoPassword(user)
		const inputs = within(dialog).getAllByPlaceholderText('••••••••')
		await user.type(inputs[0], 'PasswordActual1')
		await user.type(inputs[1], 'PasswordNueva1')
		await user.click(within(dialog).getByRole('button', { name: 'Cancelar' }))
		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		})

		const dialogReabierto = await abrirDialogoPassword(user)
		for (const input of within(dialogReabierto).getAllByPlaceholderText(
			'••••••••',
		)) {
			expect(input).toHaveValue('')
		}
	})
})
