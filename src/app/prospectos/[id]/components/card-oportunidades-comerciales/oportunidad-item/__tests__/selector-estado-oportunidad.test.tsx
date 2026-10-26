import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/estados/use-transiciones-manuales', () => ({
	useTransicionesManuales: vi.fn(),
}))
vi.mock('@/hooks/procesos-comerciales/use-cambiar-estado-manual', () => ({
	useCambiarEstadoManual: vi.fn(),
}))
vi.mock('sonner', () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}))

import type { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { useCambiarEstadoManual } from '@/hooks/procesos-comerciales/use-cambiar-estado-manual'
import { useTransicionesManuales } from '@/hooks/estados/use-transiciones-manuales'
import { toast } from 'sonner'
import { payloadSesion, RUTS_SINTETICOS } from '@/test/fixtures/sesion'
import { renderConSesion } from '@/test/helpers/render-con-sesion'
import SelectorEstadoOportunidad from '../selector-estado-oportunidad'

const useTransicionesManualesMock = vi.mocked(useTransicionesManuales)
const useCambiarEstadoManualMock = vi.mocked(useCambiarEstadoManual)

const TRANSICIONES = [
	{ codigo: 'EN_NEGOCIACION', nombre: 'En negociación', accion_requerida: 'Agendar visita' },
	{ codigo: 'GANADO', nombre: 'Cerrado ganado', accion_requerida: null },
]

const PROCESO_ABIERTO = {
	id: 321,
	cerrado: false,
	estado_actual: { codigo: 'CONTACTADO', nombre: 'Contactado' },
} as unknown as ProcesoComercial

const PROCESO_CERRADO = {
	...PROCESO_ABIERTO,
	cerrado: true,
} as unknown as ProcesoComercial

function montar({
	proceso = PROCESO_ABIERTO,
	usuarioRut = RUTS_SINTETICOS.ejecutivoComercial,
	ejecutivoComercialRut = RUTS_SINTETICOS.ejecutivoComercial,
	mutateAsync = vi.fn(async () => undefined),
	isPending = false,
}: {
	proceso?: ProcesoComercial
	usuarioRut?: string
	ejecutivoComercialRut?: string
	mutateAsync?: ReturnType<typeof vi.fn>
	isPending?: boolean
} = {}) {
	useTransicionesManualesMock.mockReturnValue({
		data: TRANSICIONES,
		isLoading: false,
	} as unknown as ReturnType<typeof useTransicionesManuales>)
	useCambiarEstadoManualMock.mockReturnValue({
		mutateAsync,
		isPending,
	} as unknown as ReturnType<typeof useCambiarEstadoManual>)

	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	})

	return renderConSesion(
		payloadSesion({ rut: usuarioRut }),
		<QueryClientProvider client={queryClient}>
			<SelectorEstadoOportunidad
				proceso={proceso}
				idProspecto={55}
				ejecutivoComercialRut={ejecutivoComercialRut}
			/>
		</QueryClientProvider>,
	)
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('SelectorEstadoOportunidad — payload del cambio de estado', () => {
	it('envía el identificador del proceso y el código de la transición elegida', async () => {
		const mutateAsync = vi.fn(async () => undefined)
		const usuario = userEvent.setup()
		await montar({ mutateAsync })

		await usuario.click(screen.getByRole('button', { name: /Contactado/ }))
		await usuario.click(await screen.findByText('En negociación'))

		await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1))
		expect(mutateAsync).toHaveBeenCalledWith({
			idProceso: 321,
			request: {
				codigo_estado_destino: 'EN_NEGOCIACION',
				observacion: 'Agendar visita',
			},
		})
	})

	it('envía observación null cuando la transición no exige acción', async () => {
		const mutateAsync = vi.fn(async () => undefined)
		const usuario = userEvent.setup()
		await montar({ mutateAsync })

		await usuario.click(screen.getByRole('button', { name: /Contactado/ }))
		await usuario.click(await screen.findByText('Cerrado ganado'))

		await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1))
		expect(mutateAsync).toHaveBeenCalledWith({
			idProceso: 321,
			request: { codigo_estado_destino: 'GANADO', observacion: null },
		})
	})
})

describe('SelectorEstadoOportunidad — quién puede cambiar el estado', () => {
	it('ofrece las transiciones al ejecutivo comercial asignado cuando el proceso está abierto', async () => {
		const usuario = userEvent.setup()
		await montar()

		await usuario.click(screen.getByRole('button', { name: /Contactado/ }))

		expect(await screen.findByText('En negociación')).toBeInTheDocument()
		expect(screen.getByText('Cerrado ganado')).toBeInTheDocument()
	})

	it('no permite cambiar el estado de un proceso cerrado, aunque el usuario sea el propietario', async () => {
		const mutateAsync = vi.fn(async () => undefined)
		const usuario = userEvent.setup()
		await montar({ proceso: PROCESO_CERRADO, mutateAsync })

		await usuario.click(screen.getByRole('button', { name: /Contactado/ }))

		expect(screen.queryByText('En negociación')).toBeNull()
		expect(mutateAsync).not.toHaveBeenCalled()
	})

	it('no permite cambiar el estado cuando el usuario no es el ejecutivo asignado', async () => {
		const mutateAsync = vi.fn(async () => undefined)
		const usuario = userEvent.setup()
		await montar({
			usuarioRut: RUTS_SINTETICOS.ejecutivoEvaluacion,
			mutateAsync,
		})

		await usuario.click(screen.getByRole('button', { name: /Contactado/ }))

		expect(screen.queryByText('En negociación')).toBeNull()
		expect(mutateAsync).not.toHaveBeenCalled()
	})
})

describe('SelectorEstadoOportunidad — reflejo del resultado', () => {
	it('confirma el cambio cuando el servidor lo acepta', async () => {
		const mutateAsync = vi.fn(async () => undefined)
		const usuario = userEvent.setup()
		await montar({ mutateAsync })

		await usuario.click(screen.getByRole('button', { name: /Contactado/ }))
		await usuario.click(await screen.findByText('En negociación'))

		await waitFor(() =>
			expect(toast.success).toHaveBeenCalledWith(
				'Estado de la oportunidad actualizado',
			),
		)
		expect(toast.error).not.toHaveBeenCalled()
	})

	it('una transición rechazada no se muestra como realizada', async () => {
		const mutateAsync = vi.fn(async () => {
			throw new Error('transición no permitida')
		})
		const usuario = userEvent.setup()
		await montar({ mutateAsync })

		await usuario.click(screen.getByRole('button', { name: /Contactado/ }))
		await usuario.click(await screen.findByText('En negociación'))

		await waitFor(() => expect(toast.error).toHaveBeenCalled())
		expect(toast.success).not.toHaveBeenCalled()
	})

	it('muestra el estado actual declarado por el proceso, no uno derivado en el cliente', async () => {
		await montar({
			proceso: {
				...PROCESO_ABIERTO,
				estado_actual: { codigo: 'EN_NEGOCIACION', nombre: 'En negociación' },
			} as unknown as ProcesoComercial,
		})

		expect(screen.getByRole('button', { name: /En negociación/ })).toBeInTheDocument()
	})
})
