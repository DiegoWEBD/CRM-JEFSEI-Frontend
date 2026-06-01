import { obtenerRecordatorios } from '@/aplicacion/recordatorios/use-cases/obtener-recordatorios/obtener-recordatorios'
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
	} catch {
		return NextResponse.json(
			{ error: 'Error obteniendo recordatorios' },
			{ status: 500 },
		)
	}
}
