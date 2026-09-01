import { axiosClient } from '@/infraestructura/axios/axios-client'
import { ObtenerProductosLineaNegocioResponse } from '../dto/obtener-productos-linea-negocio-response'
import Producto from '@/dominio/producto/producto'
import { cookies } from 'next/headers'

export const obtenerProductosLineaNegocio = async (idLineaNegocio: number): Promise<Producto[]> => {
	const cookieStore = await cookies()

	const axiosResponse = await axiosClient.get(`/lineas-negocio/${idLineaNegocio}/productos`, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})

	const response: ObtenerProductosLineaNegocioResponse = axiosResponse.data

	return response.productos
}
