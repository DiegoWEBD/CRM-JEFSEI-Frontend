import { obtenerDashboardCobranza } from '@/aplicacion/cobranza/use-cases/obtener-dashboard-cobranza/obtener-dashboard-cobranza'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const cookieStore = await cookies()

		const dashboard = await obtenerDashboardCobranza(cookieStore.toString())

		return NextResponse.json(dashboard)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo dashboard de cobranza')
	}
}
