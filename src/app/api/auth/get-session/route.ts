import { getSession } from '@/lib/auth'
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
	} catch {
		return NextResponse.json(
			{ error: 'Error obteniendo sesión' },
			{ status: 500 },
		)
	}
}
