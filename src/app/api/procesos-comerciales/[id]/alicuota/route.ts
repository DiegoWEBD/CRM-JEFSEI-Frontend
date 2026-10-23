import { ImportarAlicuotaOportunidadRequest } from '@/aplicacion/importacion-alicuotas/use-cases/importar-alicuota-oportunidad/importar-alicuota-oportunidad'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const cookieStore = await cookies()

		const response = await axiosClient.get(`/procesos-comerciales/${id}/alicuota`, {
			headers: {
				Cookie: cookieStore.toString(),
			},
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo la alícuota de la oportunidad')
	}
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const cookieStore = await cookies()
		const body: ImportarAlicuotaOportunidadRequest = await request.json()

		const response = await axiosClient.post(
			`/procesos-comerciales/${id}/alicuota`,
			body,
			{
				headers: {
					Cookie: cookieStore.toString(),
				},
			},
		)

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error importando la alícuota de la oportunidad')
	}
}
