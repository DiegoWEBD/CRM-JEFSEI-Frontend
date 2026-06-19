import { obtenerAdministradorPorId } from '@/aplicacion/administradores/use-cases/obtener-administrador-por-id/obtener-administrador-por-id'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params

	try {
		const administrador = await obtenerAdministradorPorId(Number(id))
		return NextResponse.json(administrador)
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
			{ error: 'Error obteniendo administrador' },
			{ status: 500 },
		)
	}
}
