import { obtenerProspectosPorAdministrador } from '@/aplicacion/administradores/use-cases/obtener-prospectos-por-administrador/obtener-prospectos-por-administrador'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const prospectos = await obtenerProspectosPorAdministrador(Number(id))
		return NextResponse.json(prospectos)
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
			{ error: 'Error obteniendo prospectos del administrador' },
			{ status: 500 },
		)
	}
}
