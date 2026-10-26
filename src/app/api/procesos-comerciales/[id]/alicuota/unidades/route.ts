import { ActualizarUnidadesAlicuotaRequest } from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const cookieStore = await cookies()
		const body: ActualizarUnidadesAlicuotaRequest = await request.json()

		const response = await axiosClient.patch(
			`/procesos-comerciales/${id}/alicuota/unidades`,
			body,
			{
				headers: {
					Cookie: cookieStore.toString(),
				},
			},
		)

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error actualizando las unidades de la alícuota')
	}
}
