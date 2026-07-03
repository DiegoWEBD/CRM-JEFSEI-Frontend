import { getSession } from '@/lib/auth'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const payload = await getSession()

		if (!payload)
			return NextResponse.json(
				{ error: 'Usuario no autenticado' },
				{ status: 401 },
			)

		return NextResponse.json(payload)
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
			{ error: 'Error obteniendo sesión' },
			{ status: 500 },
		)
	}
}
