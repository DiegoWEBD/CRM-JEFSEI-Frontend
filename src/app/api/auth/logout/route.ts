import { NextRequest, NextResponse } from 'next/server'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'

// Deja constancia del cierre de sesión en la bitácora del backend mientras el
// token sigue vigente. Es best-effort: el borrado de la cookie nunca depende
// de que el backend responda.
async function notificarCierreSesion() {
	try {
		const cookieStore = await cookies()
		await axiosClient.post('/auth/logout', null, {
			headers: { Cookie: cookieStore.toString() },
		})
	} catch {
		// El backend no está disponible o el token ya expiró: no bloquea el logout.
	}
}

function limpiarCookies(res: NextResponse) {
	res.cookies.set('token', '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 0,
	})
	res.cookies.set('refresh_token', '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 0,
	})
	return res
}

export async function POST() {
	await notificarCierreSesion()
	const res = NextResponse.json({ message: 'Logout exitoso' })
	return limpiarCookies(res)
}

function origenPublico(): string {
	const appUrl = process.env.APP_URL
	if (!appUrl) {
		throw new Error('APP_URL no está configurada')
	}
	try {
		return new URL(appUrl).origin
	} catch {
		throw new Error('APP_URL no es una URL válida')
	}
}

export async function GET(req: NextRequest) {
	await notificarCierreSesion()
	const origen = origenPublico()
	const redirectTo = req.nextUrl.searchParams.get('redirect') || '/login'

	const res = NextResponse.redirect(new URL(redirectTo, origen))
	return limpiarCookies(res)
}
