import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type Props = {
	params: Promise<{ id: string }>
}

export async function PATCH(_request: Request, props: Props) {
	const { id } = await props.params
	try {
		const cookieStore = await cookies()

		const response = await axiosClient.patch(`/recordatorios/${id}/completar`, null, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error completando recordatorio')
	}
}
