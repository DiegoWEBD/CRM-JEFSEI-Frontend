import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/procesos-comerciales/use-cerrar-proceso-comercial', () => ({
	useCerrarProcesoComercial: vi.fn(),
}))
vi.mock('@/hooks/procesos-comerciales/use-obtener-historial-estado', () => ({
	useObtenerHistorialEstado: vi.fn(),
}))

import type { ReporteProcesoComercial } from '@/aplicacion/procesos-comerciales/dto/reporte-proceso-comercial'
import { useCerrarProcesoComercial } from '@/hooks/procesos-comerciales/use-cerrar-proceso-comercial'
import { useObtenerHistorialEstado } from '@/hooks/procesos-comerciales/use-obtener-historial-estado'
import { payloadSesion } from '@/test/fixtures/sesion'
import { renderConSesion } from '@/test/helpers/render-con-sesion'
import DetalleProcesoDrawer from '../detalle-proceso-drawer'

const useCerrarProcesoComercialMock = vi.mocked(useCerrarProcesoComercial)
const useObtenerHistorialEstadoMock = vi.mocked(useObtenerHistorialEstado)

const REPORTE_ABIERTO = {
	proceso: {
		id: 321,
		id_prospecto: 55,
		nombre_cliente: 'Condominio Los Pinos',
		producto: 'Seguro de Vida',
		renovacion: false,
		cerrado: false,
		descartado: false,
		motivo_cierre: null,
		fecha_cierre: null,
		fecha_estimada_cierre: null,
		estado_actual: { codigo: 'CONTACTADO', nombre: 'Contactado' },
		etapa_actual: { codigo: 'OPORTUNIDAD', nombre: 'Oportunidad' },
	},
	fecha_ingreso_estado: null,
	dias_transcurridos: null,
	porentaje_sla_consumido: null,
	estado_semaforo: 'VERDE',
	dias_limite: null,
	dias_restantes: null,
	dias_atraso: null,
	mensaje_semaforo: null,
} as unknown as ReporteProcesoComercial

const REPORTE_DESCARTADO = {
	...REPORTE_ABIERTO,
	proceso: {
		...REPORTE_ABIERTO.proceso,
		cerrado: true,
		descartado: true,
		estado_actual: {
			codigo: 'OPORTUNIDAD_DESCARTADA',
			nombre: 'Oportunidad descartada',
		},
	},
} as unknown as ReporteProcesoComercial

function montar({
	reporte = REPORTE_ABIERTO,
	permisos = ['DESCARTAR_PROCESO_COMERCIAL'],
}: {
	reporte?: ReporteProcesoComercial
	permisos?: string[]
} = {}) {
	useCerrarProcesoComercialMock.mockReturnValue({
		mutateAsync: vi.fn(async () => undefined),
		isPending: false,
	} as unknown as ReturnType<typeof useCerrarProcesoComercial>)
	useObtenerHistorialEstadoMock.mockReturnValue({
		data: [],
		isLoading: false,
	} as unknown as ReturnType<typeof useObtenerHistorialEstado>)

	return renderConSesion(
		payloadSesion({ codigo_permisos: permisos }),
		<DetalleProcesoDrawer reporte={reporte} open onOpenChange={vi.fn()} />,
	)
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('DetalleProcesoDrawer — panel de gerentes (/oportunidades)', () => {
	it('no ofrece descartar oportunidades, aunque el usuario tenga el permiso', async () => {
		await montar()

		expect(
			screen.queryByRole('button', { name: 'Descartar oportunidad' }),
		).toBeNull()
	})

	it('muestra el estado descartado cuando la oportunidad ya fue descartada', async () => {
		await montar({ reporte: REPORTE_DESCARTADO })

		expect(screen.getByText('Proceso descartado')).toBeInTheDocument()
	})
})
