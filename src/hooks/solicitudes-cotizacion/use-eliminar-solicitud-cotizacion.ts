import { eliminarSolicitudCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/eliminar-solicitud-cotizacion/eliminar-solicitud-cotizacion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useEliminarSolicitudCotizacion = (
	idProspecto?: number,
	idProceso?: number,
) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (idSolicitud: number) =>
			eliminarSolicitudCotizacion(idSolicitud),
		onSuccess: (data) => {
			toast.success(data?.message ?? 'Solicitud de cotización eliminada')
			if (idProspecto) {
				queryClient.invalidateQueries({
					queryKey: ['solicitudes-cotizacion', idProspecto],
				})
				queryClient.invalidateQueries({
					queryKey: ['procesos-comerciales', idProspecto],
				})
			}
			if (idProceso) {
				queryClient.invalidateQueries({
					queryKey: ['solicitudes-proceso', idProceso],
				})
			}
		},
	})
}