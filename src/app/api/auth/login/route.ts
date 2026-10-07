import { iniciarSesion } from '@/aplicacion/auth/use-cases/iniciar-sesion'
import { TokenPayload } from '@/dtos/token-payload'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const { rut, password } = await req.json()

	try {
		const response = await iniciarSesion(rut, password)

		const payload: TokenPayload = JSON.parse(
			Buffer.from(response.access_token.split('.')[1], 'base64').toString(),
		)

		// exp viene en segundos
		const nowInSeconds = Math.floor(Date.now() / 1000)

		const maxAge = payload.exp - nowInSeconds

		// No exponer refresh_token al cliente: solo va en cookie httpOnly
		const { refresh_token, ...responseData } = response

		const res = NextResponse.json(responseData)

		// Access token: corta duración, path global
		res.cookies.set('token', response.access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge,
		})

		// Refresh token: larga duración, path global para que proxy.ts pueda leerlo
		if (refresh_token) {
			res.cookies.set('refresh_token', refresh_token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				path: '/',
				maxAge: 30 * 24 * 60 * 60, // 30 días
			})
		}

		return res
	} catch (error) {
		return normalizarErrorServidor(error, 'Credenciales inválidas')
	}
}
