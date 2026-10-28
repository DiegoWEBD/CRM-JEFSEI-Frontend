import { iniciarRenovacionPoliza } from '@/aplicacion/polizas/use-cases/iniciar-renovacion-poliza/iniciar-renovacion-poliza'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useIniciarRenovacion = (numeroPoliza: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: () => iniciarRenovacionPoliza(numeroPoliza),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['poliza', numeroPoliza] })
			queryClient.invalidateQueries({ queryKey: ['polizas'] })
		},
	})
}
