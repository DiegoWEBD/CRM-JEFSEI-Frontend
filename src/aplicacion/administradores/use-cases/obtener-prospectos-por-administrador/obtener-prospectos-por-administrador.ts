import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerProspectosPorAdministradorResponse } from './dto/obtener-prospectos-por-administrador-response'

export const obtenerProspectosPorAdministrador = async (
	id: number,
): Promise<ProspectoResumenJson[]> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get(
		`/administradores/${id}/prospectos`,
		{
			headers: { Cookie: cookieStore.toString() },
		},
	)

	const data: ObtenerProspectosPorAdministradorResponse = response.data

	return data.data
}
