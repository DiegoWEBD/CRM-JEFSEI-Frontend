import { CrearPlanPagoRequest } from '@/aplicacion/polizas/use_cases/crear_plan_pago/dto/crear_plan_pago_request'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const useCrearPlanPago = (numeroPoliza: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: CrearPlanPagoRequest) =>
			axios.post(`/api/polizas/${numeroPoliza}/plan-pago`, request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['plan-pago', numeroPoliza] })
		},
	})
}
