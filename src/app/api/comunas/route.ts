import { obtenerComunas } from '@/aplicacion/comunas/use-cases/obtener-comunas'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const comunas = await obtenerComunas()

		return NextResponse.json(comunas)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo comunas')
	}
}
