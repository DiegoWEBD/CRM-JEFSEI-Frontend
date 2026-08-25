import { actualizarPoliza } from '@/aplicacion/polizas/use-cases/actualizar-poliza/actualizar-poliza'
import { ActualizarPolizaRequest } from '@/aplicacion/polizas/use-cases/actualizar-poliza/dto/requests/actualizar-poliza-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useActualizarPoliza = (numeroPoliza: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: ActualizarPolizaRequest) =>
			actualizarPoliza(numeroPoliza, request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['poliza', numeroPoliza] })
			queryClient.invalidateQueries({ queryKey: ['polizas'] })
		},
	})
}
