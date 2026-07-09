import { DashboardCobranza } from '@/dominio/cobranza/dashboard-cobranza'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { ObtenerDashboardCobranzaResponse } from './dto/obtener-dashboard-cobranza-response'

export const obtenerDashboardCobranza = async (
	cookie: string,
): Promise<DashboardCobranza> => {
	const response = await axiosClient.get('/cobranza/dashboard', {
		headers: {
			Cookie: cookie,
		},
	})

	const data: ObtenerDashboardCobranzaResponse = response.data
	return data
}
