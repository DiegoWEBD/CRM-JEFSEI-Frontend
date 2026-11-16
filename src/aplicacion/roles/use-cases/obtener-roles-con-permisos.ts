import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerRolesConPermisosResponse } from '../dtos/rol-con-permisos-json'

export const obtenerRolesConPermisos =
	async (): Promise<ObtenerRolesConPermisosResponse> => {
		const cookieStore = await cookies()

		const response = await axiosClient.get('/roles/con-permisos', {
			headers: { Cookie: cookieStore.toString() },
		})

		return response.data as ObtenerRolesConPermisosResponse
	}
