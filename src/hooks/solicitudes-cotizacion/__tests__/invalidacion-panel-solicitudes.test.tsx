import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('axios', () => ({ default: { post: vi.fn() } }))
vi.mock('sonner', () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}))
vi.mock(
	'@/aplicacion/cotizaciones/use-cases/registrar-cotizacion/registrar-cotizacion',
	() => ({ registrarCotizacion: vi.fn() }),
)
vi.mock(
	'@/aplicacion/cotizaciones/use-cases/actualizar-cotizacion/actualizar-cotizacion',
	() => ({ actualizarCotizacion: vi.fn() }),
)
vi.mock(
	'@/aplicacion/cotizaciones/use-cases/eliminar-cotizacion/eliminar-cotizacion',
	() => ({ eliminarCotizacion: vi.fn() }),
)
vi.mock(
	'@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-cotizacion/solicitar-cotizacion',
	() => ({ solicitarCotizacion: vi.fn() }),
)
vi.mock(
	'@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-recotizacion/solicitar-recotizacion',
	() => ({ solicitarRecotizacion: vi.fn() }),
)
vi.mock(
	'@/aplicacion/solicitudes-cotizacion/use-cases/eliminar-solicitud-cotizacion/eliminar-solicitud-cotizacion',
	() => ({ eliminarSolicitudCotizacion: vi.fn() }),
)
vi.mock(
	'@/aplicacion/estudio-comercial/use-cases/subir-estudio-comercial/subir-estudio-comercial',
	() => ({ subirEstudioComercial: vi.fn() }),
)

import { actualizarCotizacion } from '@/aplicacion/cotizaciones/use-cases/actualizar-cotizacion/actualizar-cotizacion'
import { eliminarCotizacion } from '@/aplicacion/cotizaciones/use-cases/eliminar-cotizacion/eliminar-cotizacion'
import { registrarCotizacion } from '@/aplicacion/cotizaciones/use-cases/registrar-cotizacion/registrar-cotizacion'
import { eliminarSolicitudCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/eliminar-solicitud-cotizacion/eliminar-solicitud-cotizacion'
import { solicitarCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-cotizacion/solicitar-cotizacion'
import { solicitarRecotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-recotizacion/solicitar-recotizacion'
import { subirEstudioComercial } from '@/aplicacion/estudio-comercial/use-cases/subir-estudio-comercial/subir-estudio-comercial'
import { useActualizarCotizacion } from '@/hooks/cotizaciones/use-actualizar-cotizacion'
import { useEliminarCotizacion } from '@/hooks/cotizaciones/use-eliminar-cotizacion'
import { useRegistrarCotizacion } from '@/hooks/cotizaciones/use-registrar-cotizacion'
import { useEliminarSolicitudCotizacion } from '@/hooks/solicitudes-cotizacion/use-eliminar-solicitud-cotizacion'
import { useSolicitarCotizacion } from '@/hooks/solicitudes-cotizacion/use-solicitar-cotizacion'
import { useSolicitarCotizacionProceso } from '@/hooks/solicitudes-cotizacion/use-solicitar-cotizacion-proceso'
import { useSolicitarRecotizacion } from '@/hooks/solicitudes-cotizacion/use-solicitar-recotizacion'
import { useSubirEstudioComercial } from '@/hooks/estudio-comercial/use-subir-estudio-comercial'

function wrapperDe(queryClient: QueryClient) {
	function QueryClientProviderDePruebas({ children }: { children: ReactNode }) {
		return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	}
	QueryClientProviderDePruebas.displayName = 'QueryClientProviderDePruebas'
	return QueryClientProviderDePruebas
}

/**
 * Cada mutación sobre solicitudes/cotizaciones debe invalidar el prefijo
 * ['solicitudes-cotizacion'] para refrescar también el panel paginado.
 */
async function verificarInvalidacionPanel(
	montar: (
		queryClient: QueryClient,
	) => Promise<void>,
) {
	const queryClient = new QueryClient()
	const spy = vi.spyOn(queryClient, 'invalidateQueries')

	await montar(queryClient)

	expect(spy).toHaveBeenCalledWith({ queryKey: ['solicitudes-cotizacion'] })
	expect(spy).toHaveBeenCalledWith({ queryKey: ['panel-estudios'] })
}

beforeEach(() => {
	vi.mocked(registrarCotizacion).mockResolvedValue({ message: 'ok' })
	vi.mocked(actualizarCotizacion).mockResolvedValue({ message: 'ok' })
	vi.mocked(eliminarCotizacion).mockResolvedValue({ message: 'ok' })
	vi.mocked(solicitarCotizacion).mockResolvedValue({ message: 'ok' })
	vi.mocked(solicitarRecotizacion).mockResolvedValue({ message: 'ok' })
	vi.mocked(eliminarSolicitudCotizacion).mockResolvedValue({ message: 'ok' })
	vi.mocked(subirEstudioComercial).mockResolvedValue({ message: 'ok' } as never)
	vi.mocked(axios.post).mockResolvedValue({ data: { message: 'ok' } })
})

describe('invalidación del panel de solicitudes de cotización', () => {
	it('registrar cotización', async () => {
		await verificarInvalidacionPanel(async queryClient => {
			const { result } = renderHook(() => useRegistrarCotizacion(1, 10), {
				wrapper: wrapperDe(queryClient),
			})
			await result.current.mutateAsync({} as never)
		})
	})

	it('registrar cotización sin idProspecto también refresca el panel', async () => {
		await verificarInvalidacionPanel(async queryClient => {
			const { result } = renderHook(() => useRegistrarCotizacion(1), {
				wrapper: wrapperDe(queryClient),
			})
			await result.current.mutateAsync({} as never)
		})
	})

	it('actualizar cotización', async () => {
		await verificarInvalidacionPanel(async queryClient => {
			const { result } = renderHook(() => useActualizarCotizacion(1, 10), {
				wrapper: wrapperDe(queryClient),
			})
			await result.current.mutateAsync({ idCotizacion: 5 } as never)
		})
	})

	it('eliminar cotización', async () => {
		await verificarInvalidacionPanel(async queryClient => {
			const { result } = renderHook(() => useEliminarCotizacion(1, 10), {
				wrapper: wrapperDe(queryClient),
			})
			await result.current.mutateAsync(5)
		})
	})

	it('solicitar cotización', async () => {
		await verificarInvalidacionPanel(async queryClient => {
			const { result } = renderHook(() => useSolicitarCotizacion(10), {
				wrapper: wrapperDe(queryClient),
			})
			await result.current.mutateAsync({} as never)
		})
	})

	it('solicitar recotización', async () => {
		await verificarInvalidacionPanel(async queryClient => {
			const { result } = renderHook(() => useSolicitarRecotizacion(1), {
				wrapper: wrapperDe(queryClient),
			})
			await result.current.mutateAsync({} as never)
		})
	})

	it('eliminar solicitud de cotización', async () => {
		await verificarInvalidacionPanel(async queryClient => {
			const { result } = renderHook(() => useEliminarSolicitudCotizacion(10, 3), {
				wrapper: wrapperDe(queryClient),
			})
			await result.current.mutateAsync(1)
		})
	})

	it('solicitar cotización desde la oportunidad', async () => {
		await verificarInvalidacionPanel(async queryClient => {
			const { result } = renderHook(() => useSolicitarCotizacionProceso(3, 10), {
				wrapper: wrapperDe(queryClient),
			})
			await result.current.mutateAsync({} as never)
		})
	})

	it('subir estudio comercial también refresca el panel de cotizaciones', async () => {
		const queryClient = new QueryClient()
		const spy = vi.spyOn(queryClient, 'invalidateQueries')

		const { result } = renderHook(() => useSubirEstudioComercial(1, 10), {
			wrapper: wrapperDe(queryClient),
		})
		await result.current.mutateAsync({ archivo: new File([], 'e.pdf') })

		expect(spy).toHaveBeenCalledWith({ queryKey: ['panel-estudios'] })
	})
})
