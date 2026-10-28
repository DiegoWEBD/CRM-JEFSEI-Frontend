import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../selector-estado-oportunidad', () => ({ default: () => null }))
vi.mock('../probabilidad-cierre-cell', () => ({ default: () => null }))
vi.mock('../fecha-estimada-cierre-cell', () => ({ default: () => null }))
vi.mock('../seccion-alicuota-oportunidad', () => ({ default: () => null }))
vi.mock('../../sheet-registrar-poliza/sheet-registrar-poliza', () => ({
	default: () => null,
}))
vi.mock(
	'../../../card-solicitudes-cotizacion/solicitud-cotizacion-item/solicitud-cotizacion-item',
	() => ({ default: () => null }),
)
vi.mock('@/components/solicitud-cotizacion/dialog-nueva-solicitud-cotizacion', () => ({
	default: () => null,
}))
vi.mock('@/hooks/solicitudes-cotizacion/use-obtener-solicitudes-por-proceso', () => ({
	useObtenerSolicitudesPorProceso: vi.fn(),
}))
vi.mock('@/hooks/procesos-comerciales/use-descartar-proceso-comercial', () => ({
	useDescartarProcesoComercial: vi.fn(),
}))
vi.mock('sonner', () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}))

import type { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { useDescartarProcesoComercial } from '@/hooks/procesos-comerciales/use-descartar-proceso-comercial'
import { useObtenerSolicitudesPorProceso } from '@/hooks/solicitudes-cotizacion/use-obtener-solicitudes-por-proceso'
import { toast } from 'sonner'
import { payloadSesion, RUTS_SINTETICOS } from '@/test/fixtures/sesion'
import { renderConSesion } from '@/test/helpers/render-con-sesion'
import OportunidadItem from '../oportunidad-item'

const useDescartarProcesoComercialMock = vi.mocked(useDescartarProcesoComercial)
const useObtenerSolicitudesPorProcesoMock = vi.mocked(
	useObtenerSolicitudesPorProceso,
)

const PROCESO_ABIERTO = {
	id: 321,
	producto: 'Seguro de Vida',
	tipo_producto: 'vida',
	renovacion: false,
	cerrado: false,
	descartado: false,
	estado_actual: { codigo: 'CONTACTADO', nombre: 'Contactado' },
	probabilidad_cierre_sistema: 0.1,
	probabilidad_cierre_ejecutivo: null,
	prima_cotizada: null,
	prima_esperada: null,
	prima_potencial_estimada: null,
} as unknown as ProcesoComercial

const PROCESO_CERRADO = {
	...PROCESO_ABIERTO,
	cerrado: true,
} as unknown as ProcesoComercial

const PROCESO_DESCARTADO = {
	...PROCESO_ABIERTO,
	cerrado: true,
	descartado: true,
} as unknown as ProcesoComercial

function montar({
	proceso = PROCESO_ABIERTO,
	permisos = ['DESCARTAR_PROCESO_COMERCIAL'],
	ejecutivoComercialRut = RUTS_SINTETICOS.ejecutivoComercial,
	mutateAsync = vi.fn(async () => undefined),
	isPending = false,
}: {
	proceso?: ProcesoComercial
	permisos?: string[]
	ejecutivoComercialRut?: string
	mutateAsync?: ReturnType<typeof vi.fn>
	isPending?: boolean
} = {}) {
	useObtenerSolicitudesPorProcesoMock.mockReturnValue({
		data: [],
		isLoading: false,
	} as unknown as ReturnType<typeof useObtenerSolicitudesPorProceso>)
	useDescartarProcesoComercialMock.mockReturnValue({
		mutateAsync,
		isPending,
	} as unknown as ReturnType<typeof useDescartarProcesoComercial>)

	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	})

	return renderConSesion(
		payloadSesion({ codigo_permisos: permisos }),
		<QueryClientProvider client={queryClient}>
			<OportunidadItem
				proceso={proceso}
				idProspecto={55}
				informacionCompleta
				nombreCliente='Condominio Los Pinos'
				lineaNegocioNombre='Vida'
				ejecutivoComercialRut={ejecutivoComercialRut}
			/>
		</QueryClientProvider>,
	)
}

async function expandirOportunidad(usuario: ReturnType<typeof userEvent.setup>) {
	await usuario.click(screen.getByText('Seguro de Vida'))
}

async function abrirDialogoDescarte(usuario: ReturnType<typeof userEvent.setup>) {
	await usuario.click(
		screen.getByRole('button', { name: /Descartar oportunidad/ }),
	)
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('OportunidadItem — visibilidad del descarte', () => {
	it('ofrece descartar al ejecutivo asignado con el permiso cuando la oportunidad está abierta', async () => {
		const usuario = userEvent.setup()
		await montar()

		await expandirOportunidad(usuario)

		expect(
			screen.getByRole('button', { name: /Descartar oportunidad/ }),
		).toBeInTheDocument()
	})

	it('no ofrece descartar sin el permiso DESCARTAR_PROCESO_COMERCIAL', async () => {
		const usuario = userEvent.setup()
		await montar({
			permisos: ['REGISTRAR_PROSPECTO', 'ADMINISTRAR_PROCESOS_COMERCIALES_PROPIOS'],
		})

		await expandirOportunidad(usuario)

		expect(
			screen.queryByRole('button', { name: /Descartar oportunidad/ }),
		).toBeNull()
	})

	it('no ofrece descartar cuando el usuario no es el ejecutivo comercial asignado', async () => {
		const usuario = userEvent.setup()
		await montar({ ejecutivoComercialRut: RUTS_SINTETICOS.ejecutivoEvaluacion })

		await expandirOportunidad(usuario)

		expect(
			screen.queryByRole('button', { name: /Descartar oportunidad/ }),
		).toBeNull()
	})

	it('no ofrece descartar una oportunidad cerrada', async () => {
		const usuario = userEvent.setup()
		await montar({ proceso: PROCESO_CERRADO })

		await expandirOportunidad(usuario)

		expect(
			screen.queryByRole('button', { name: /Descartar oportunidad/ }),
		).toBeNull()
	})

	it('no ofrece descartar una oportunidad ya descartada', async () => {
		const usuario = userEvent.setup()
		await montar({ proceso: PROCESO_DESCARTADO })

		await expandirOportunidad(usuario)

		expect(
			screen.queryByRole('button', { name: /Descartar oportunidad/ }),
		).toBeNull()
	})
})

describe('OportunidadItem — payload del descarte', () => {
	it('envía el proceso y la observación escrita al confirmar el descarte', async () => {
		const mutateAsync = vi.fn(async () => undefined)
		const usuario = userEvent.setup()
		await montar({ mutateAsync })

		await expandirOportunidad(usuario)
		await abrirDialogoDescarte(usuario)
		await usuario.type(
			screen.getByPlaceholderText('Motivo del descarte...'),
			'Cliente no interesado',
		)
		await usuario.click(
			screen.getByRole('button', { name: 'Confirmar descarte' }),
		)

		await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1))
		expect(mutateAsync).toHaveBeenCalledWith({
			idProceso: 321,
			request: { observacion: 'Cliente no interesado' },
		})
	})

	it('envía observación null cuando se confirma sin escribir motivo', async () => {
		const mutateAsync = vi.fn(async () => undefined)
		const usuario = userEvent.setup()
		await montar({ mutateAsync })

		await expandirOportunidad(usuario)
		await abrirDialogoDescarte(usuario)
		await usuario.click(
			screen.getByRole('button', { name: 'Confirmar descarte' }),
		)

		await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1))
		expect(mutateAsync).toHaveBeenCalledWith({
			idProceso: 321,
			request: { observacion: null },
		})
	})
})

describe('OportunidadItem — reflejo del resultado', () => {
	it('confirma el descarte cuando el servidor lo acepta', async () => {
		const mutateAsync = vi.fn(async () => undefined)
		const usuario = userEvent.setup()
		await montar({ mutateAsync })

		await expandirOportunidad(usuario)
		await abrirDialogoDescarte(usuario)
		await usuario.click(
			screen.getByRole('button', { name: 'Confirmar descarte' }),
		)

		await waitFor(() =>
			expect(toast.success).toHaveBeenCalledWith(
				'Oportunidad descartada exitosamente',
			),
		)
	})

	it('un descarte rechazado no se muestra como realizado', async () => {
		const mutateAsync = vi.fn(async () => {
			throw new Error('no autorizado')
		})
		const usuario = userEvent.setup()
		await montar({ mutateAsync })

		await expandirOportunidad(usuario)
		await abrirDialogoDescarte(usuario)
		await usuario.click(
			screen.getByRole('button', { name: 'Confirmar descarte' }),
		)

		await waitFor(() => expect(mutateAsync).toHaveBeenCalled())
		expect(toast.success).not.toHaveBeenCalled()
	})
})
