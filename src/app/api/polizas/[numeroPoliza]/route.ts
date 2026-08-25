import { obtenerPoliza } from '@/aplicacion/polizas/use_cases/obtener_poliza/obtener_poliza'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ numeroPoliza: string }> },
) {
	try {
		const { numeroPoliza } = await params

		const data = await obtenerPoliza(numeroPoliza)

		return NextResponse.json(data)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo póliza' },
			{ status: 500 },
		)
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ numeroPoliza: string }> },
) {
	try {
		const { numeroPoliza } = await params
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.put(`/polizas/${numeroPoliza}`, body, {
			headers: {
				Cookie: cookieStore.toString(),
			},
		})

		return NextResponse.json(response.data)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error actualizando póliza' },
			{ status: 500 },
		)
	}
}
