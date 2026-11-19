import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ rut: string }> },
) {
	try {
		const { rut } = await params
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.put(`/usuarios/${rut}/password`, body, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error actualizando contraseña')
	}
}
