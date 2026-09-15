import { ActualizarValorUfM2PersonalizadoRequest } from '@/aplicacion/prospectos/use-cases/actualizar-valor-uf-m2-personalizado/dto/requests/actualizar-valor-uf-m2-personalizado-request'
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
		const body: ActualizarValorUfM2PersonalizadoRequest = await request.json()

		const response = await axiosClient.patch(
			`/prospectos/condominios/${id}/valor-uf-m2-personalizado`,
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
			'Error al actualizar valor UF/m2 personalizado',
		)
	}
}
