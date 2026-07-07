import { reactivarPoliza } from '@/aplicacion/polizas/use-cases/reactivar-poliza/reactivar-poliza'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useReactivarPoliza = (numeroPoliza: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: () => reactivarPoliza(numeroPoliza),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['poliza', numeroPoliza] })
			queryClient.invalidateQueries({ queryKey: ['polizas'] })
		},
	})
}
