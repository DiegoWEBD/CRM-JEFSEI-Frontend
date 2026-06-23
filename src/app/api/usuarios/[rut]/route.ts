import { obtenerUsuarioPorRut } from '@/aplicacion/usuarios/use-cases/obtener-usuario-por-rut'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ rut: string }> },
) {
	try {
		const { rut } = await params
		const cookieStore = await cookies()
		const usuario = await obtenerUsuarioPorRut(rut, cookieStore.toString())
		return NextResponse.json(usuario)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo usuario' },
			{ status: 500 },
		)
	}
}
