import { obtenerCompaniesSeguros } from '@/aplicacion/companies-seguros/use-cases/obtener-companies-seguros'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const companies = await obtenerCompaniesSeguros()

		return NextResponse.json(companies)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo companies seguros')
	}
}
