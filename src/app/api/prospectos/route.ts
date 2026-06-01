import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CrearProspectoRequest } from './dto/requests/crear-prospecto-request'

export async function GET() {
	try {
		const prospectos = await obtenerProspectos()
		return NextResponse.json(prospectos)
	} catch {
		return NextResponse.json(
			{ error: 'Error creando recordatorio' },
			{ status: 500 },
		)
	}
}

export async function POST(request: Request) {
	try {
		const body: CrearProspectoRequest = await request.json()
		const cookieStore = await cookies()

		await axiosClient.post('/prospectos', body, {
			headers: {
				Cookie: cookieStore.toString(),
			},
		})

		return NextResponse.json({ status: 201 })
	} catch {
		return NextResponse.json(
			{ error: 'Error creando recordatorio' },
			{ status: 500 },
		)
	}
}
