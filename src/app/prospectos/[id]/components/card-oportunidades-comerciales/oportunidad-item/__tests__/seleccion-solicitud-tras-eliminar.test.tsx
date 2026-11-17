import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
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
	() => ({
		default: ({ solicitud }: { solicitud: { id: number } }) =>
			'detalle-solicitud-' + solicitud.id,
	}),
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
import type SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'
import { AuthProvider } from '@/contexts/auth-context'
import { useDescartarProcesoComercial } from '@/hooks/procesos-comerciales/use-descartar-proceso-comercial'
import { useObtenerSolicitudesPorProceso } from '@/hooks/solicitudes-cotizacion/use-obtener-solicitudes-por-proceso'
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

function crearSolicitud(id: number): SolicitudCotizacion {
	return {
		id,
		nombre_riesgo: `Riesgo ${id}`,
		informacion_completa: true,
		ejecutivo_comercial: 'Ana Pérez',
		tipo: 'vida',
		producto: 'Seguro de Vida',
		prioridad: 'MEDIA',
		fecha: '2024-01-15',
		cantidad_cotizaciones: 0,
	} as unknown as SolicitudCotizacion
}

async function montar(solicitudesIniciales: SolicitudCotizacion[]) {
	useDescartarProcesoComercialMock.mockReturnValue({
		mutateAsync: vi.fn(async () => undefined),
		isPending: false,
	} as unknown as ReturnType<typeof useDescartarProcesoComercial>)

	// Los datos viven en una variable mutable para simular el refetch de
	// React Query tras una eliminación sin reiniciar el estado del árbol.
	let solicitudesActuales = solicitudesIniciales
	useObtenerSolicitudesPorProcesoMock.mockImplementation(
		() =>
			({
				data: solicitudesActuales,
				isLoading: false,
			}) as unknown as ReturnType<typeof useObtenerSolicitudesPorProceso>,
	)

	const payload = payloadSesion({
		codigo_permisos: ['DESCARTAR_PROCESO_COMERCIAL'],
	})
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	})

	const armarArbol = () => (
		<QueryClientProvider client={queryClient}>
			<OportunidadItem
				proceso={PROCESO_ABIERTO}
				idProspecto={55}
				informacionCompleta
				nombreCliente='Condominio Los Pinos'
				lineaNegocioNombre='Vida'
				ejecutivoComercialRut={RUTS_SINTETICOS.ejecutivoComercial}
			/>
		</QueryClientProvider>
	)

	const utils = await renderConSesion(payload, armarArbol())

	const refetchSolicitudes = async (nuevas: SolicitudCotizacion[]) => {
		solicitudesActuales = nuevas
		// Mismo árbol con nuevos datos: conserva el estado interno (como el
		// índice seleccionado), igual que un refetch de React Query.
		utils.rerender(
			<AuthProvider initialPayload={payload}>{armarArbol()}</AuthProvider>,
		)
	}

	return { ...utils, refetchSolicitudes }
}

async function expandirOportunidad(usuario: ReturnType<typeof userEvent.setup>) {
	await usuario.click(screen.getByText('Seguro de Vida'))
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('OportunidadItem — selección de solicitudes tras eliminar', () => {
	it('mantiene visibles las solicitudes restantes al eliminar la última', async () => {
		const usuario = userEvent.setup()
		const { refetchSolicitudes } = await montar([
			crearSolicitud(1),
			crearSolicitud(2),
			crearSolicitud(3),
		])

		await expandirOportunidad(usuario)
		await usuario.click(screen.getByRole('button', { name: /Solicitud 3/ }))
		expect(screen.getByText('detalle-solicitud-3')).toBeInTheDocument()

		await refetchSolicitudes([crearSolicitud(1), crearSolicitud(2)])

		expect(
			screen.queryByText(
				'No hay solicitudes de cotización para esta oportunidad.',
			),
		).toBeNull()
		expect(
			screen.getByRole('button', { name: /Solicitud 1/ }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: /Solicitud 2/ }),
		).toBeInTheDocument()
		expect(screen.getByText('detalle-solicitud-2')).toBeInTheDocument()

		// La navegación por las restantes sigue funcionando.
		await usuario.click(screen.getByRole('button', { name: /Solicitud 1/ }))
		expect(screen.getByText('detalle-solicitud-1')).toBeInTheDocument()
	})

	it('muestra la solicitud restante al eliminar la última de dos', async () => {
		const usuario = userEvent.setup()
		const { refetchSolicitudes } = await montar([
			crearSolicitud(1),
			crearSolicitud(2),
		])

		await expandirOportunidad(usuario)
		await usuario.click(screen.getByRole('button', { name: /Solicitud 2/ }))
		expect(screen.getByText('detalle-solicitud-2')).toBeInTheDocument()

		await refetchSolicitudes([crearSolicitud(1)])

		expect(
			screen.queryByText(
				'No hay solicitudes de cotización para esta oportunidad.',
			),
		).toBeNull()
		expect(screen.getByText('detalle-solicitud-1')).toBeInTheDocument()
	})

	it('sigue mostrando la primera tras eliminar la primera de varias', async () => {
		const usuario = userEvent.setup()
		const { refetchSolicitudes } = await montar([
			crearSolicitud(1),
			crearSolicitud(2),
			crearSolicitud(3),
		])

		await expandirOportunidad(usuario)
		expect(screen.getByText('detalle-solicitud-1')).toBeInTheDocument()

		await refetchSolicitudes([crearSolicitud(2), crearSolicitud(3)])

		expect(screen.getByText('detalle-solicitud-2')).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: /Solicitud 1/ }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: /Solicitud 2/ }),
		).toBeInTheDocument()
	})

	it('muestra el estado vacío cuando se elimina la única solicitud', async () => {
		const usuario = userEvent.setup()
		const { refetchSolicitudes } = await montar([crearSolicitud(1)])

		await expandirOportunidad(usuario)
		expect(screen.getByText('detalle-solicitud-1')).toBeInTheDocument()

		await refetchSolicitudes([])

		expect(
			screen.getByText('No hay solicitudes de cotización para esta oportunidad.'),
		).toBeInTheDocument()
	})
})
