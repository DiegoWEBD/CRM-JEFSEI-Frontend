import PlanPago from '@/dominio/plan-pago/plan-pago'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ObtenerPlanPagoResponse } from '@/aplicacion/polizas/use_cases/dto/obtener_plan_pago_response'

export const useObtenerPlanPago = (numeroPoliza: string) => {
	return useQuery<PlanPago>({
		queryKey: ['plan-pago', numeroPoliza],
		queryFn: async () => {
			const response = await axios.get(`/api/polizas/${numeroPoliza}/plan-pago`)
			const data: ObtenerPlanPagoResponse = response.data
			return data.plan_pago
		},
		enabled: Boolean(numeroPoliza),
	})
}
