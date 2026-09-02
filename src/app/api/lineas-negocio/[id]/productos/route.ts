import { obtenerProductosLineaNegocio } from '@/aplicacion/linea-negocio/use-cases/obtener-productos-linea-negocio'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const idLineaNegocio = parseInt(id, 10)

		if (isNaN(idLineaNegocio)) {
			return NextResponse.json(
				{ error: 'ID de línea de negocio inválido' },
				{ status: 400 },
			)
		}

		const productos = await obtenerProductosLineaNegocio(idLineaNegocio)

		return NextResponse.json(productos)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo productos de la línea de negocio' },
			{ status: 500 },
		)
	}
}
