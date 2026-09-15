import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const cookieStore = await cookies()
		const response = await axiosClient.get('/configuracion-condominio/parametros-depreciacion', {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo parámetros de depreciación')
	}
}

export async function PUT(request: Request) {
	try {
		const cookieStore = await cookies()
		const body = await request.json()

		const response = await axiosClient.put('/configuracion-condominio/parametros-depreciacion', body, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error guardando parámetros de depreciación')
	}
}
