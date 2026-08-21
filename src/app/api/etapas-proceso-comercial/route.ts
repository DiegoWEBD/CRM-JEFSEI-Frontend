import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const cookieStore = await cookies()
		const response = await axiosClient.get('/etapas-proceso-comercial/', {
			headers: { Cookie: cookieStore.toString() },
		})
		return NextResponse.json(response.data)
	} catch {
		return NextResponse.json(
			{ error: 'Error obteniendo etapas' },
			{ status: 500 },
		)
	}
}
