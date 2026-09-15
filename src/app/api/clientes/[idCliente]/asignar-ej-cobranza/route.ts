import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ idCliente: string }> },
) {
	try {
		const { idCliente } = await params
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.post(
			`/clientes/${idCliente}/asignar-ej-cobranza`,
			body,
			{ headers: { Cookie: cookieStore.toString() } },
		)

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error asignando ejecutivo de cobranza')
	}
}
