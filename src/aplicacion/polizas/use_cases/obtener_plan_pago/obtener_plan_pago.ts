import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerPlanPagoResponse } from '../dto/obtener_plan_pago_response'

export const obtenerPlanPago = async (
	numeroPoliza: string,
): Promise<ObtenerPlanPagoResponse> => {
	const cookieStore = await cookies()
	const response = await axiosClient.get(`/polizas/${numeroPoliza}/plan-pago`, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})
	const data: ObtenerPlanPagoResponse = response.data
	return data
}
