import { obtenerAdministradores } from '@/aplicacion/administradores/use-cases/obtener-administradores/obtener-administradores'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const administradores = await obtenerAdministradores()
		return NextResponse.json(administradores)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{
					error:
						error.response?.data?.error ||
						error.response?.data?.detail ||
						error.message,
				},
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo administradores' },
			{ status: 500 },
		)
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.post('/administradores', body, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data, { status: 201 })
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{
					error:
						error.response?.data?.error ||
						error.response?.data?.detail ||
						error.message,
				},
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error creando administrador' },
			{ status: 500 },
		)
	}
}
