import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import {
	ObtenerEstadosConfiguracionResponse,
} from '../dto/estado-configuracion'

/**
 * Listado completo de estados del proceso comercial con su configuración.
 *
 * Es un dataset fijo (pocos registros), por lo que no se pagina: el filtrado
 * por búsqueda se hace en el cliente.
 */
export const obtenerEstadosConfiguracion =
	async (): Promise<ObtenerEstadosConfiguracionResponse> => {
		const cookieStore = await cookies()

		const response = await axiosClient.get('/estados/configuracion', {
			headers: { Cookie: cookieStore.toString() },
		})

		return response.data as ObtenerEstadosConfiguracionResponse
	}
