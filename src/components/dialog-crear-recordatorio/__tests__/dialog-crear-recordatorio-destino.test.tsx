import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/recordatorios/use-registrar-recordatorio', () => ({
	useRegistrarRecordatorio: vi.fn(),
}))
vi.mock('@/hooks/recordatorios/use-actualizar-recordatorio', () => ({
	useActualizarRecordatorio: vi.fn(),
}))
vi.mock('@/hooks/usuarios/use-usuarios', () => ({
	useUsuarios: vi.fn(),
}))

import type Recordatorio from '@/dominio/recordatorio/recordatorio'
import { useActualizarRecordatorio } from '@/hooks/recordatorios/use-actualizar-recordatorio'
import { useRegistrarRecordatorio } from '@/hooks/recordatorios/use-registrar-recordatorio'
import { useUsuarios } from '@/hooks/usuarios/use-usuarios'
import { payloadSesion, RUTS_SINTETICOS } from '@/test/fixtures/sesion'
import { renderConSesion } from '@/test/helpers/render-con-sesion'
import DialogCrearRecordatorio from '../dialog-crear-recordatorio'

const useRegistrarRecordatorioMock = vi.mocked(useRegistrarRecordatorio)
const useActualizarRecordatorioMock = vi.mocked(useActualizarRecordatorio)
const useUsuariosMock = vi.mocked(useUsuarios)

const PERMISO_GLOBAL = 'CREAR_RECORDATORIO_GLOBAL'

const DESTINO = {
	rut: RUTS_SINTETICOS.ejecutivoCobranza,
	nombre: 'Ana Gerenta',
}

function recordatorioFixture() {
	return {
		id: 1,
		titulo: 'Llamar al cliente',
		detalle: null,
		completado: false,
		prioridad: 'normal',
		tipo_gestion: 'llamada',
		fecha_recordatorio: '2026-12-01T10:00:00',
		id_prospecto: null,
	} as unknown as Recordatorio
}

async function montar({
	permisos = [PERMISO_GLOBAL],
	editarRecordatorio = null,
	mutate = vi.fn(),
}: {
	permisos?: string[]
	editarRecordatorio?: Recordatorio | null
	mutate?: ReturnType<typeof vi.fn>
} = {}) {
	useRegistrarRecordatorioMock.mockReturnValue({
		mutate,
		isPending: false,
	} as unknown as ReturnType<typeof useRegistrarRecordatorio>)
	useActualizarRecordatorioMock.mockReturnValue({
		mutate: vi.fn(),
		isPending: false,
	} as unknown as ReturnType<typeof useActualizarRecordatorio>)
	useUsuariosMock.mockReturnValue({
		data: {
			data: [DESTINO],
			total: 1,
			pagina: 1,
			tamano_pagina: 100,
			total_paginas: 1,
		},
		isLoading: false,
	} as unknown as ReturnType<typeof useUsuarios>)

	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	})

	return renderConSesion(
		payloadSesion({ codigo_permisos: permisos }),
		<QueryClientProvider client={queryClient}>
			<DialogCrearRecordatorio
				open
				onOpenChange={vi.fn()}
				editarRecordatorio={editarRecordatorio}
			/>
		</QueryClientProvider>,
	)
}

function obtenerSelectorDestino() {
	return (
		screen.queryByRole('combobox', { name: 'Asignar a (opcional)' }) ??
		screen.getByRole('button', { name: 'Asignar a (opcional)' })
	)
}

function selectorDestinoVisible() {
	return (
		screen.queryByRole('combobox', { name: 'Asignar a (opcional)' }) !== null ||
		screen.queryByRole('button', { name: 'Asignar a (opcional)' }) !== null
	)
}

async function guardarRecordatorio(usuario: ReturnType<typeof userEvent.setup>) {
	await usuario.type(screen.getByPlaceholderText('Título'), 'Llamar al cliente')
	await usuario.click(screen.getByRole('button', { name: 'Guardar' }))
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('DialogCrearRecordatorio — usuario destino', () => {
	it('muestra el selector de destino con el permiso CREAR_RECORDATORIO_GLOBAL', async () => {
		await montar({ permisos: [PERMISO_GLOBAL] })

		expect(selectorDestinoVisible()).toBe(true)
	})

	it('no muestra el selector de destino sin el permiso CREAR_RECORDATORIO_GLOBAL', async () => {
		await montar({ permisos: ['CREAR_RECORDATORIO_PROPIO'] })

		expect(selectorDestinoVisible()).toBe(false)
	})

	it('no muestra el selector de destino en modo edición', async () => {
		await montar({ editarRecordatorio: recordatorioFixture() })

		expect(selectorDestinoVisible()).toBe(false)
	})

	it('sin destino elegido envía rut_usuario_destino null', async () => {
		const mutate = vi.fn()
		const usuario = userEvent.setup()
		await montar({ permisos: [PERMISO_GLOBAL], mutate })

		await guardarRecordatorio(usuario)

		expect(mutate).toHaveBeenCalledTimes(1)
		expect(mutate.mock.calls[0][0]).toMatchObject({
			titulo: 'Llamar al cliente',
			rut_usuario_destino: null,
		})
	})

	it('al elegir un usuario destino lo envía en la petición', async () => {
		const mutate = vi.fn()
		const usuario = userEvent.setup()
		await montar({ permisos: [PERMISO_GLOBAL], mutate })

		await usuario.click(obtenerSelectorDestino())
		// El select nativo oculto de Radix (BubbleSelect, dentro del <form>)
		// replica las opciones: se filtra por rol 'option' visible (Radix).
		await usuario.click(
			await screen.findByRole('option', { name: DESTINO.nombre }),
		)
		await guardarRecordatorio(usuario)

		expect(mutate).toHaveBeenCalledTimes(1)
		expect(mutate.mock.calls[0][0]).toMatchObject({
			titulo: 'Llamar al cliente',
			rut_usuario_destino: DESTINO.rut,
		})
	})
})
