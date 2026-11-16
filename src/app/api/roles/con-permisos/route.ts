import { obtenerRolesConPermisos } from '@/aplicacion/roles/use-cases/obtener-roles-con-permisos'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const resultado = await obtenerRolesConPermisos()

		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo roles con permisos')
	}
}
