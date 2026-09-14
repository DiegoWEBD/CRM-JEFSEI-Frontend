import { obtenerRecordatorios } from '@/aplicacion/recordatorios/use-cases/obtener-recordatorios/obtener-recordatorios'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)

		const fecha = searchParams.get('fecha')
		const idProspecto = searchParams.get('id_prospecto')
		const pagina = searchParams.get('pagina')
		const tamanoPagina = searchParams.get('tamano_pagina')

		const resultado = await obtenerRecordatorios({
			fecha: fecha ?? '',
			id_prospecto: idProspecto ? Number(idProspecto) : null,
			pagina: pagina ? Number(pagina) : 1,
			tamano_pagina: tamanoPagina ? Number(tamanoPagina) : 15,
		})

		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo recordatorios')
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.post('/recordatorios', body, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data, { status: 201 })
	} catch (error) {
		return normalizarErrorServidor(error, 'Error registrando recordatorio')
	}
}
