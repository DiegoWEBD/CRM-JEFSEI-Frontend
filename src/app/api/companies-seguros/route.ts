import { obtenerCompaniesSeguros } from '@/aplicacion/companies-seguros/use-cases/obtener-companies-seguros'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const companies = await obtenerCompaniesSeguros()

		return NextResponse.json(companies)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo companies seguros' },
			{ status: 500 },
		)
	}
}
