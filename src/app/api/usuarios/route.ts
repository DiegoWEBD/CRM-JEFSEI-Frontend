import { obtenerUsuarios } from '@/aplicacion/usuarios/use-cases/obtener-usuarios'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const cookieStore = await cookies()
		const usuarios = await obtenerUsuarios(cookieStore.toString())
		return NextResponse.json(usuarios)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo usuarios' },
			{ status: 500 },
		)
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.post('/usuarios', body, {
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
			{ error: 'Error registrando usuario' },
			{ status: 500 },
		)
	}
}
