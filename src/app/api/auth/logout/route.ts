import { NextRequest, NextResponse } from 'next/server'

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
	return logout()
}

export async function GET(req: NextRequest) {
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
