import { obtenerSucursales } from '@/aplicacion/sucursales/use-cases/obtener-sucursales'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const sucursales = await obtenerSucursales()
		return NextResponse.json(sucursales)
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
			{ error: 'Error obteniendo sucursales' },
			{ status: 500 },
		)
	}
}
