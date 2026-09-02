import { obtenerRecordatorios } from '@/aplicacion/recordatorios/use-cases/obtener-recordatorios/obtener-recordatorios'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
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
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo recordatorios' },
			{ status: 500 },
		)
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
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error registrando recordatorio' },
			{ status: 500 },
		)
	}
}
