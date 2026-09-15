import { obtenerProductosLineaNegocio } from '@/aplicacion/linea-negocio/use-cases/obtener-productos-linea-negocio'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
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
		return normalizarErrorServidor(error, 'Error obteniendo productos de la línea de negocio')
	}
}
