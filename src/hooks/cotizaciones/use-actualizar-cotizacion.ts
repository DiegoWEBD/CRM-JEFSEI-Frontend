import { actualizarCotizacion } from '@/aplicacion/cotizaciones/use-cases/actualizar-cotizacion/actualizar-cotizacion'
import type { ActualizarCotizacionRequest } from '@/aplicacion/cotizaciones/use-cases/actualizar-cotizacion/dto/actualizar-cotizacion-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useActualizarCotizacion = (idSolicitud: number, idProspecto?: number) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			idCotizacion,
			...request
		}: ActualizarCotizacionRequest & { idCotizacion: number }) =>
			actualizarCotizacion(idSolicitud, idCotizacion, request),
		onSuccess: (data) => {
			toast.success(data?.message ?? 'Cotización actualizada')
			queryClient.invalidateQueries({
				queryKey: ['cotizaciones', idSolicitud],
			})
			if (idProspecto) {
				queryClient.invalidateQueries({
					queryKey: ['solicitudes-cotizacion', idProspecto],
				})
				queryClient.invalidateQueries({
					queryKey: ['procesos-comerciales', idProspecto],
				})
			}
		},
	})
}