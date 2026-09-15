import { obtenerComunicadosGerencia } from '@/aplicacion/comunicados-gerencia/obtener-comunicados-gerencia/obtener-comunicados-gerencia'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const cookieStore = await cookies()

		const comunicados = await obtenerComunicadosGerencia(cookieStore.toString())

		return NextResponse.json(comunicados)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo comunicados')
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.post('/comunicados-gerencia', body, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data, { status: 201 })
	} catch (error) {
		return normalizarErrorServidor(error, 'Error registrando comunicado')
	}
}
