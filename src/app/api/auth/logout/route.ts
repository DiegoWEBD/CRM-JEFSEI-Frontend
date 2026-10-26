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

/**
 * Reduce el destino de la redirección a un path interno de esta aplicación.
 *
 * Un valor como `//evil.com`, `/\evil.com` o `https://evil.com` resuelve contra
 * un dominio externo (open redirect, CWE-601) y un `javascript:` llegaría tal
 * cual al header `Location`. Se resuelve contra el origen público y se comprueba
 * que el origen coincida; si no, se usa `/login`. Al devolver solo
 * `pathname + search + hash` tampoco se puede reinyectar un origen absoluto.
 */
function destinoInternoSeguro(redirectTo: string | null): string {
	const fallback = '/login'
	if (!redirectTo) return fallback

	let destino: URL
	try {
		destino = new URL(redirectTo, origenPublico())
	} catch {
		return fallback
	}

	if (destino.origin !== origenPublico()) return fallback

	return `${destino.pathname}${destino.search}${destino.hash}`
}

export async function GET(req: NextRequest) {
	await notificarCierreSesion()
	const origen = origenPublico()
	const redirectTo = destinoInternoSeguro(req.nextUrl.searchParams.get('redirect'))

	const res = NextResponse.redirect(new URL(redirectTo, origen))
	return limpiarCookies(res)
}
