import { marcarPagoCuota } from '@/aplicacion/cuotas/use-cases/marcar-pago-cuota/marcar-pago-cuota'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useMarcarPagoCuota = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (idCuota: number) => marcarPagoCuota(idCuota),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['plan-pago'] })
			queryClient.invalidateQueries({ queryKey: ['dashboard-cobranza'] })
		},
	})
}
