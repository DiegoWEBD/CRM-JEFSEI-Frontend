'use client'

import { TokenPayload } from '@/dtos/token-payload'
import { obtenerSesion } from '@/aplicacion/auth/use-cases/obtener-sesion'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

type AuthContextValue = {
	usuario: TokenPayload | null
	cargando: boolean
	tieneRol: (rol: string) => boolean
	tieneAlgunRol: (roles: string[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
	children: ReactNode
	initialPayload: TokenPayload | null
}

export function AuthProvider({ children, initialPayload }: AuthProviderProps) {
	const [usuario, setUsuario] = useState<TokenPayload | null>(initialPayload)
	const [cargando, setCargando] = useState(false)

	useEffect(() => {
		obtenerSesion()
			.then(payload => setUsuario(payload))
			.catch(() => setUsuario(null))
			.finally(() => setCargando(false))
	}, [])

	useEffect(() => {
		function onSessionExpired() {
			setUsuario(null)
		}
		window.addEventListener('session-expired', onSessionExpired)
		return () => window.removeEventListener('session-expired', onSessionExpired)
	}, [])

	const tieneRol = useCallback(
		(rol: string) => usuario?.codigo_roles.includes(rol) ?? false,
		[usuario],
	)

	const tieneAlgunRol = useCallback(
		(roles: string[]) => roles.some(r => usuario?.codigo_roles.includes(r) ?? false),
		[usuario],
	)

	return (
		<AuthContext.Provider value={{ usuario, cargando, tieneRol, tieneAlgunRol }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuthContext() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuthContext debe usarse dentro de un AuthProvider')
	return ctx
}
