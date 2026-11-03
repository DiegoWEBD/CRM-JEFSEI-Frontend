import { ActualizarPorcentajeDepreciacionPersonalizadoRequest } from '@/aplicacion/prospectos/use-cases/actualizar-porcentaje-depreciacion-personalizado/dto/requests/actualizar-porcentaje-depreciacion-personalizado-request'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const cookieStore = await cookies()
		const cookie = cookieStore.toString()
		const { id } = await params
		const body: ActualizarPorcentajeDepreciacionPersonalizadoRequest =
			await request.json()

		const response = await axiosClient.patch(
			`/prospectos/condominios/${id}/porcentaje-depreciacion-personalizado`,
			body,
			{
				headers: {
					Cookie: cookie,
				},
			},
		)

		return NextResponse.json({
			status: response.status,
			message: response.data.message,
		})
	} catch (error) {
		return normalizarErrorServidor(
			error,
			'Error al actualizar porcentaje de depreciación personalizado',
		)
	}
}
