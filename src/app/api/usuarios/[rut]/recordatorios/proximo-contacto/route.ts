import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ rut: string }> },
) {
	try {
		const { rut } = await params
		const { searchParams } = new URL(request.url)
		const idProspecto = searchParams.get('id_prospecto')

		if (!idProspecto) {
			return NextResponse.json(
				{ error: 'id_prospecto es requerido' },
				{ status: 400 },
			)
		}

		const cookieStore = await cookies()
		const response = await axiosClient.get(`/usuarios/${rut}/recordatorios/proximo-contacto`, {
			params: { id_prospecto: Number(idProspecto) },
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo próximo contacto')
	}
}
