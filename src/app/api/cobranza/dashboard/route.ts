import { obtenerDashboardCobranza } from '@/aplicacion/cobranza/use-cases/obtener-dashboard-cobranza/obtener-dashboard-cobranza'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const cookieStore = await cookies()

		const dashboard = await obtenerDashboardCobranza(cookieStore.toString())

		return NextResponse.json(dashboard)
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
			{ error: 'Error obteniendo dashboard de cobranza' },
			{ status: 500 },
		)
	}
}
