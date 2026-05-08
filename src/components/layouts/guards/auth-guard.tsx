'use client'

import { useAuthStore } from '@/global_states/auth-store'
import { ReactNode } from 'react'

type AuthGuardProps = {
	children: ReactNode
	codigosRoles?: string[]
}

export default function AuthGuard({
	children,
	codigosRoles = [],
}: AuthGuardProps) {
	const { usuario, hydrated } = useAuthStore()

	if (!hydrated) return null

	if (!usuario) {
		return null
	}

	if (codigosRoles.length > 0) {
		const tieneRol = usuario.roles.some(rol =>
			codigosRoles.includes(rol.codigo),
		)

		if (!tieneRol) {
			return null
		}
	}

	return <>{children}</>
}
