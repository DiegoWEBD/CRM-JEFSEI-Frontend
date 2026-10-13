import {
	actualizarEstadoConfiguracion,
	ActualizarEstadoConfiguracionRequest,
} from '@/aplicacion/estados-admin/use-cases/actualizar-estado-configuracion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useActualizarEstadoConfiguracion = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: ActualizarEstadoConfiguracionRequest) =>
			actualizarEstadoConfiguracion(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['estados-configuracion'] })
			toast.success('Configuración del estado actualizada')
		},
	})
}
