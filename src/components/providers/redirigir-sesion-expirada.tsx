'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { urlLoginConDestino } from '@/lib/rutas'

/**
 * Redirige a /login cuando la sesión expira estando dentro de la app.
 *
 * Escucha `session-expired` (el interceptor de axios lo despacha cuando el
 * refresh falla, y AuthProvider cuando get-session responde 401). Conserva la
 * ruta actual en ?next= para volver a ella tras el login. No hace nada si ya
 * estamos en /login, para evitar bucles (p. ej. un 401 del propio login).
 */
export default function RedirigirSesionExpirada() {
	const router = useRouter()

	useEffect(() => {
		function onSessionExpired() {
			const { pathname, search } = window.location
			if (pathname === '/login') return
			router.replace(urlLoginConDestino(pathname, search))
		}

		window.addEventListener('session-expired', onSessionExpired)
		return () => window.removeEventListener('session-expired', onSessionExpired)
	}, [router])

	return null
}
