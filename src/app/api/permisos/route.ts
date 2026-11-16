import { obtenerPermisos } from '@/aplicacion/permisos/use-cases/obtener-permisos'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const resultado = await obtenerPermisos()

		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo permisos')
	}
}
