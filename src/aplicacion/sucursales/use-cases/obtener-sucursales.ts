import Sucursal from '@/dominio/sucursal/sucursal'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { ObtenerSucursalesResponse } from '../dto/obtener-sucursales-response'
import { cookies } from 'next/headers'

export const obtenerSucursales = async (): Promise<Sucursal[]> => {
	const cookieStore = await cookies()
	const response = await axiosClient.get('/sucursales', {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})

	const data: ObtenerSucursalesResponse = response.data
	return data.sucursales
}
