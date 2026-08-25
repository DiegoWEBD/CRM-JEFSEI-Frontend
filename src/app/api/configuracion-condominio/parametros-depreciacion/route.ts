import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
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
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{
					error:
						error.response?.data?.detail ||
						error.response?.data?.error ||
						error.message,
				},
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo parámetros de depreciación' },
			{ status: 500 },
		)
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
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{
					error:
						error.response?.data?.detail ||
						error.response?.data?.error ||
						error.message,
				},
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error guardando parámetros de depreciación' },
			{ status: 500 },
		)
	}
}
