import { iniciarSesion } from '@/aplicacion/auth/use-cases/iniciar-sesion'
import { TokenPayload } from '@/dtos/token-payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const { rut, password } = await req.json()

	try {
		const response = await iniciarSesion(rut, password)

		const payload: TokenPayload = JSON.parse(
			Buffer.from(response.access_token.split('.')[1], 'base64').toString(),
		)

		console.log(payload)

		// exp viene en segundos
		const nowInSeconds = Math.floor(Date.now() / 1000)

		const maxAge = payload.exp - nowInSeconds

		const res = NextResponse.json({
			...response,
		})

		res.cookies.set('token', response.access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge,
		})

		return res
	} catch {
		return NextResponse.json(
			{ error: 'Credenciales inválidas' },
			{ status: 401 },
		)
	}
}
