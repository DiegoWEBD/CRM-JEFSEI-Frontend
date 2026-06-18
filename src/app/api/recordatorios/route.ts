import { obtenerRecordatorios } from '@/aplicacion/recordatorios/use-cases/obtener-recordatorios/obtener-recordatorios'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)

		const fecha = searchParams.get('fecha')
		const idProspecto = searchParams.get('id_prospecto')

		const recordatorios = await obtenerRecordatorios({
			fecha: fecha ?? '',
			id_prospecto: idProspecto ? Number(idProspecto) : null,
		})

		return NextResponse.json(recordatorios)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo recordatorios' },
			{ status: 500 },
		)
	}
}
