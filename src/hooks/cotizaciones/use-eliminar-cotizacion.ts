import { eliminarCotizacion } from '@/aplicacion/cotizaciones/use-cases/eliminar-cotizacion/eliminar-cotizacion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useEliminarCotizacion = (idSolicitud: number, idProspecto?: number) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (idCotizacion: number) =>
			eliminarCotizacion(idSolicitud, idCotizacion),
		onSuccess: (data) => {
			toast.success(data?.message ?? 'Cotización eliminada')
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