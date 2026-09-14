import { obtenerSucursales } from '@/aplicacion/sucursales/use-cases/obtener-sucursales'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const sucursales = await obtenerSucursales()
		return NextResponse.json(sucursales)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo sucursales')
	}
}
