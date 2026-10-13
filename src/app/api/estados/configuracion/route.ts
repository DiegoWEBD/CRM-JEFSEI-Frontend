import { obtenerEstadosConfiguracion } from '@/aplicacion/estados-admin/use-cases/obtener-estados-configuracion'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const resultado = await obtenerEstadosConfiguracion()

		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(
			error,
			'Error obteniendo la configuración de estados',
		)
	}
}
