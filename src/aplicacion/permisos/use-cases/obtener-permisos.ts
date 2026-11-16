import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerPermisosResponse } from '../dtos/obtener-permisos-response'

export const obtenerPermisos =
	async (): Promise<ObtenerPermisosResponse> => {
		const cookieStore = await cookies()

		const response = await axiosClient.get('/permisos', {
			headers: { Cookie: cookieStore.toString() },
		})

		return response.data as ObtenerPermisosResponse
	}
