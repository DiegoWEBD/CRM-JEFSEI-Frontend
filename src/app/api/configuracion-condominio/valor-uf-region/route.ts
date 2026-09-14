import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const cookieStore = await cookies()
		const response = await axiosClient.get('/configuracion-condominio/valor-uf-region', {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo valores UF por región')
	}
}

export async function PUT(request: Request) {
	try {
		const cookieStore = await cookies()
		const body = await request.json()

		const response = await axiosClient.put('/configuracion-condominio/valor-uf-region', body, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error guardando valor UF por región')
	}
}
