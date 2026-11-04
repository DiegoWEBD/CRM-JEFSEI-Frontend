import { ActualizarProspectoEmpresaRequest } from '@/aplicacion/prospectos/use-cases/actualizar-prospecto-empresa/dto/requests/actualizar-prospecto-empresa-request'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
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
		const body: ActualizarProspectoEmpresaRequest = await request.json()

		const response = await axiosClient.put(
			`/prospectos/empresas/${id}`,
			body,
			{
				headers: {
					Cookie: cookie,
				},
			},
		)

		return NextResponse.json({ status: response.status, message: response.data.message })
	} catch (error) {
		return normalizarErrorServidor(error, 'Error al actualizar la información del prospecto')
	}
}
