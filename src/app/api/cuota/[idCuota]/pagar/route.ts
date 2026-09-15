import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(
	_request: Request,
	{ params }: { params: Promise<{ idCuota: string }> },
) {
	try {
		const { idCuota } = await params
		const cookieStore = await cookies()

		const response = await axiosClient.post(
			`/cuota/${idCuota}/pagar`,
			{},
			{ headers: { Cookie: cookieStore.toString() } },
		)

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error marcando cuota como pagada')
	}
}
