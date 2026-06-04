import { ActualizarProspectoCondominioRequest } from '@/aplicacion/prospectos/use-cases/actualizar-prospecto-condominio/dto/requests/actualizar-prospecto-condominio-request'
import { ActualizarProspectoCondominioResponse } from '@/aplicacion/prospectos/use-cases/actualizar-prospecto-condominio/dto/responses/actualizar-prospecto-condominio-response'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const cookieStore = await cookies()
		const cookie = cookieStore.toString()
		const { id } = await params
		const body: ActualizarProspectoCondominioRequest = await request.json()

		const response = await axiosClient.put(
			`/prospectos/condominios/${id}`,
			body,
			{
				headers: {
					Cookie: cookie,
				},
			},
		)

		const data: ActualizarProspectoCondominioResponse = response.data

		return NextResponse.json({ status: response.status, message: data.message })
	} catch {
		return NextResponse.json(
			{ error: 'Error al actualizar la información del prospecto' },
			{ status: 500 },
		)
	}
}
