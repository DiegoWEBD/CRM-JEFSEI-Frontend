import { obtenerLineasNegocio } from '@/aplicacion/linea-negocio/use-cases/obtener-lineas-negocio'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const lineasNegocio = await obtenerLineasNegocio()

		return NextResponse.json(lineasNegocio)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo líneas de negocio')
	}
}
