import { getSession } from '@/lib/auth'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
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
		return normalizarErrorServidor(error, 'Error obteniendo sesión')
	}
}
