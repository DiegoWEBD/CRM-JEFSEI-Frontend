import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../informacion-prospecto/informacion-prospecto', () => ({
	default: () => null,
}))
vi.mock('../formulario-actualizar-prospecto/formulario-actualizar-prospecto', () => ({
	default: () => null,
}))
vi.mock('@/hooks/lineas-negocio/use-lineas-negocio', () => ({
	useLineasNegocio: vi.fn(),
}))
vi.mock('@/hooks/procesos-comerciales/use-obtener-procesos-comerciales', () => ({
	useObtenerProcesosComerciales: vi.fn(),
}))
vi.mock('@/hooks/prospectos/use-cambiar-linea-negocio', () => ({
	useCambiarLineaNegocio: vi.fn(),
}))
vi.mock('sonner', () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}))

import type { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { useLineasNegocio } from '@/hooks/lineas-negocio/use-lineas-negocio'
import { useObtenerProcesosComerciales } from '@/hooks/procesos-comerciales/use-obtener-procesos-comerciales'
import { useCambiarLineaNegocio } from '@/hooks/prospectos/use-cambiar-linea-negocio'
import { toast } from 'sonner'
import { payloadSesion, RUTS_SINTETICOS } from '@/test/fixtures/sesion'
import { renderConSesion } from '@/test/helpers/render-con-sesion'
import CardInformacionProspecto from '../card-informacion-prospecto'
import DialogCambiarLineaNegocio from '../dialog-cambiar-linea-negocio/dialog-cambiar-linea-negocio'

const useLineasNegocioMock = vi.mocked(useLineasNegocio)
const useObtenerProcesosComercialesMock = vi.mocked(useObtenerProcesosComerciales)
const useCambiarLineaNegocioMock = vi.mocked(useCambiarLineaNegocio)

const LINEAS_NEGOCIO = [
	{ id: 10, nombre: 'Condominio' },
	{ id: 11, nombre: 'Líneas Personales' },
]

const OPORTUNIDAD_ABIERTA = {
	id: 321,
	producto: 'Seguro de Vida',
	nombre_cliente: 'Cliente A',
	cerrado: false,
} as unknown as ProcesoComercial

const OTRA_OPORTUNIDAD_ABIERTA = {
	id: 322,
	producto: 'Seguro de Incendio',
	nombre_cliente: 'Cliente B',
	cerrado: false,
} as unknown as ProcesoComercial

const PROSPECTO = {
	id: 55,
	nombre_riesgo: 'Condominio Los Pinos',
	linea_negocio: { id: 10, nombre: 'Condominio' },
	registrado_por: { rut: '55.555.555-5', nombre: 'Registrador' },
	ultima_actualizacion: new Date().toISOString(),
	ejecutivo_comercial_asignado: {
		rut: RUTS_SINTETICOS.ejecutivoComercial,
		nombre: 'Ejecutivo Comercial',
	},
} as unknown as Parameters<typeof CardInformacionProspecto>[0]['prospecto']

function montarHooks({
	oportunidades = [OPORTUNIDAD_ABIERTA, OTRA_OPORTUNIDAD_ABIERTA],
	mutateAsync = vi.fn(async () => ({
		message: 'ok',
		oportunidades_descartadas: oportunidades.length,
	})),
	isPending = false,
}: {
	oportunidades?: ProcesoComercial[]
	mutateAsync?: ReturnType<typeof vi.fn>
	isPending?: boolean
} = {}) {
	useLineasNegocioMock.mockReturnValue({
		data: LINEAS_NEGOCIO,
		isLoading: false,
	} as unknown as ReturnType<typeof useLineasNegocio>)
	useObtenerProcesosComercialesMock.mockReturnValue({
		data: oportunidades,
		isLoading: false,
	} as unknown as ReturnType<typeof useObtenerProcesosComerciales>)
	useCambiarLineaNegocioMock.mockReturnValue({
		mutateAsync,
		isPending,
	} as unknown as ReturnType<typeof useCambiarLineaNegocio>)
	return mutateAsync
}

function renderizar(
	ui: React.ReactNode,
	sesion: { permisos?: string[]; rut?: string } = {},
) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	})
	return renderConSesion(
		payloadSesion({
			codigo_permisos: sesion.permisos ?? ['CAMBIAR_LINEA_NEGOCIO_PROSPECTO'],
			...(sesion.rut ? { rut: sesion.rut } : {}),
		}),
		<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
	)
}

async function montarCard() {
	montarHooks()
	return renderizar(<CardInformacionProspecto prospecto={PROSPECTO} />)
}

async function montarDialogo(
	opciones: Parameters<typeof montarHooks>[0] = {},
) {
	const mutateAsync = montarHooks(opciones)
	const utils = await renderizar(<DialogCambiarLineaNegocio prospecto={PROSPECTO} />)
	return { mutateAsync, ...utils }
}

function obtenerSelectorLinea() {
	return (
		screen.queryByRole('combobox') ??
		screen.getByRole('button', { name: /Seleccione una línea de negocio/ })
	)
}

async function abrirDialogo(usuario: ReturnType<typeof userEvent.setup>) {
	await usuario.click(
		screen.getByRole('button', { name: 'Cambiar línea de negocio' }),
	)
}

async function seleccionarLinea(
	usuario: ReturnType<typeof userEvent.setup>,
	nombre: string,
) {
	await usuario.click(obtenerSelectorLinea())
	await usuario.click(await screen.findByText(nombre))
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('CardInformacionProspecto — visibilidad de la acción', () => {
	it('ofrece cambiar la línea al ejecutivo asignado con el permiso CAMBIAR_LINEA_NEGOCIO_PROSPECTO', async () => {
		await montarCard()

		expect(
			screen.getByRole('button', { name: 'Cambiar línea de negocio' }),
		).toBeInTheDocument()
	})

	it('no ofrece cambiar la línea sin el permiso CAMBIAR_LINEA_NEGOCIO_PROSPECTO', async () => {
		montarHooks()
		await renderizar(<CardInformacionProspecto prospecto={PROSPECTO} />, {
			permisos: ['ACTUALIZAR_DATOS_PROSPECTO'],
		})

		expect(
			screen.queryByRole('button', { name: 'Cambiar línea de negocio' }),
		).toBeNull()
	})

	it('no ofrece cambiar la línea cuando el usuario no es el ejecutivo comercial asignado', async () => {
		montarHooks()
		await renderizar(<CardInformacionProspecto prospecto={PROSPECTO} />, {
			rut: RUTS_SINTETICOS.ejecutivoEvaluacion,
		})

		expect(
			screen.queryByRole('button', { name: 'Cambiar línea de negocio' }),
		).toBeNull()
	})
})

describe('DialogCambiarLineaNegocio — confirmación del cambio', () => {
	it('avisa que el descarte de oportunidades abiertas es irreversible', async () => {
		const usuario = userEvent.setup()
		await montarDialogo()
		await abrirDialogo(usuario)

		expect(
			await screen.findByText(/Esta acción es irreversible/),
		).toBeInTheDocument()
		expect(
			screen.getByText(/se descartarán de forma permanente 2 oportunidades abiertas/),
		).toBeInTheDocument()
		expect(
			screen.getByText('Oportunidades que se descartarán (2)'),
		).toBeInTheDocument()
		expect(screen.getByText('Seguro de Vida — Cliente A')).toBeInTheDocument()
		expect(screen.getByText('Seguro de Incendio — Cliente B')).toBeInTheDocument()
	})

	it('usa singular cuando solo hay una oportunidad abierta', async () => {
		const usuario = userEvent.setup()
		await montarDialogo({ oportunidades: [OPORTUNIDAD_ABIERTA] })
		await abrirDialogo(usuario)

		expect(
			await screen.findByText(/se descartará de forma permanente 1 oportunidad abierta/),
		).toBeInTheDocument()
	})

	it('muestra que no se descartará ninguna oportunidad cuando no hay abiertas', async () => {
		const usuario = userEvent.setup()
		await montarDialogo({ oportunidades: [] })
		await abrirDialogo(usuario)

		expect(
			await screen.findByText(/no se descartará ninguna oportunidad/),
		).toBeInTheDocument()
	})

	it('solo ofrece líneas de negocio distintas a la actual', async () => {
		const usuario = userEvent.setup()
		await montarDialogo()
		await abrirDialogo(usuario)
		await usuario.click(obtenerSelectorLinea())

		expect(await screen.findByText('Líneas Personales')).toBeInTheDocument()
		expect(screen.queryByText('Condominio')).toBeNull()
	})
})

describe('DialogCambiarLineaNegocio — payload del cambio', () => {
	it('envía la línea seleccionada al confirmar', async () => {
		const usuario = userEvent.setup()
		const { mutateAsync } = await montarDialogo()

		await abrirDialogo(usuario)
		await seleccionarLinea(usuario, 'Líneas Personales')
		await usuario.click(
			screen.getByRole('button', { name: 'Confirmar cambio de línea' }),
		)

		await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1))
		expect(mutateAsync).toHaveBeenCalledWith({ id_linea_negocio: 11 })
	})

	it('no permite confirmar sin elegir una línea', async () => {
		const usuario = userEvent.setup()
		const { mutateAsync } = await montarDialogo()

		await abrirDialogo(usuario)

		expect(
			screen.getByRole('button', { name: 'Confirmar cambio de línea' }),
		).toBeDisabled()
		expect(mutateAsync).not.toHaveBeenCalled()
	})

	it('no llama a la mutación al cancelar', async () => {
		const usuario = userEvent.setup()
		const { mutateAsync } = await montarDialogo()

		await abrirDialogo(usuario)
		await seleccionarLinea(usuario, 'Líneas Personales')
		await usuario.click(screen.getByRole('button', { name: 'Cancelar' }))

		expect(mutateAsync).not.toHaveBeenCalled()
		expect(toast.success).not.toHaveBeenCalled()
	})
})

describe('DialogCambiarLineaNegocio — reflejo del resultado', () => {
	it('informa el conteo de oportunidades descartadas cuando el servidor acepta', async () => {
		const usuario = userEvent.setup()
		const { mutateAsync } = await montarDialogo()

		await abrirDialogo(usuario)
		await seleccionarLinea(usuario, 'Líneas Personales')
		await usuario.click(
			screen.getByRole('button', { name: 'Confirmar cambio de línea' }),
		)

		await waitFor(() =>
			expect(toast.success).toHaveBeenCalledWith(
				'Línea de negocio cambiada. Se descartaron 2 oportunidades abiertas',
			),
		)
		expect(mutateAsync).toHaveBeenCalledTimes(1)
	})

	it('no menciona descartes cuando no había oportunidades abiertas', async () => {
		const usuario = userEvent.setup()
		await montarDialogo({ oportunidades: [] })

		await abrirDialogo(usuario)
		await seleccionarLinea(usuario, 'Líneas Personales')
		await usuario.click(
			screen.getByRole('button', { name: 'Confirmar cambio de línea' }),
		)

		await waitFor(() =>
			expect(toast.success).toHaveBeenCalledWith(
				'Línea de negocio cambiada exitosamente',
			),
		)
	})

	it('un cambio rechazado no se muestra como realizado', async () => {
		const usuario = userEvent.setup()
		const mutateAsync = vi.fn(async () => {
			throw new Error('no autorizado')
		})
		await montarDialogo({ mutateAsync })

		await abrirDialogo(usuario)
		await seleccionarLinea(usuario, 'Líneas Personales')
		await usuario.click(
			screen.getByRole('button', { name: 'Confirmar cambio de línea' }),
		)

		await waitFor(() => expect(mutateAsync).toHaveBeenCalled())
		expect(toast.success).not.toHaveBeenCalled()
		expect(toast.error).toHaveBeenCalled()
	})
})
