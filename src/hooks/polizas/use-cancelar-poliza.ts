import { cancelarPoliza } from '@/aplicacion/polizas/use-cases/cancelar-poliza/cancelar-poliza'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCancelarPoliza = (numeroPoliza: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: () => cancelarPoliza(numeroPoliza),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['poliza', numeroPoliza] })
			queryClient.invalidateQueries({ queryKey: ['polizas'] })
		},
	})
}
