import { NextRequest, NextResponse } from 'next/server'
import { axiosClient } from '@/infraestructura/axios/axios-client'

// Deja constancia del cierre de sesión en la bitácora del backend mientras el
// token sigue vigente. Es best-effort: el borrado de la cookie nunca depende
// de que el backend responda.
async function notificarCierreSesion() {
	try {
		const cookiesModule = await import('next/headers')
		const cookieStore = await cookiesModule.cookies()
		await axiosClient.post('/auth/logout', null, {
			headers: { Cookie: cookieStore.toString() },
		})
	} catch {
		// El backend no está disponible o el token ya expiró: no bloquea el logout.
	}
}

function logout() {
	const res = NextResponse.json({ message: 'Logout exitoso' })
	res.cookies.set('token', '', {
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
	return logout()
}

export async function GET(req: NextRequest) {
	await notificarCierreSesion()
	const redirectTo = req.nextUrl.searchParams.get('redirect') || '/login'
	const res = NextResponse.redirect(new URL(redirectTo, req.url))
	res.cookies.set('token', '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 0,
	})
	return res
}
