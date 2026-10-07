import { NextRequest, NextResponse } from 'next/server'
import { refrescarTokensEnBackend, cookieOptionsToken, cookieOptionsRefresh } from '@/lib/refresh-tokens'

/**
 * Endpoint BFF para rotar el refresh token (SPA interceptor).
 *
 * El navegador envía la cookie ``refresh_token`` automáticamente.
 * Este route handler la extrae, la envía al backend, y setea las nuevas cookies.
 *
 * Devuelve el access_token en el body para que el interceptor cliente pueda
 * actualizar el context de autenticación sin un roundtrip extra a /get-session.
 */
export async function POST(req: NextRequest) {
	const refreshToken = req.cookies.get('refresh_token')?.value

	if (!refreshToken) {
		return NextResponse.json(
			{ error: 'No se encontró refresh token' },
			{ status: 401 },
		)
	}

	const resultado = await refrescarTokensEnBackend(refreshToken)

	if (!resultado) {
		// Refresh token inválido o reusado: limpiar todo
		const res = NextResponse.json(
			{ error: 'Refresh token inválido' },
			{ status: 401 },
		)

		res.cookies.set('token', '', { ...cookieOptionsToken(0), maxAge: 0 })
		res.cookies.set('refresh_token', '', { ...cookieOptionsRefresh(), maxAge: 0 })

		return res
	}

	const res = NextResponse.json({
		access_token: resultado.access_token,
		token_type: 'bearer',
		expire_minutes: resultado.expire_minutes,
	})

	res.cookies.set('token', resultado.access_token, cookieOptionsToken(resultado.expire_minutes))
	res.cookies.set('refresh_token', resultado.refresh_token, cookieOptionsRefresh())

	return res
}