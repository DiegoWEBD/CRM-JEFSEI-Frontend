'use client'

import { obtenerSesion } from '@/aplicacion/auth/use-cases/obtener-sesion'
import { TokenPayload } from '@/dtos/token-payload'
import { ReactNode, useCallback, useEffect, useState } from 'react'

type AuthGuardProps = {
	children: ReactNode
	codigosRoles?: string[]
}

export default function AuthGuard({
	children,
	codigosRoles = [],
}: AuthGuardProps) {
	const [permitido, setPermitido] = useState<boolean>(false)

	const validar = useCallback(
		(payload: TokenPayload | null): boolean => {
			if (!payload) {
				return false
			}

			if (codigosRoles.length === 0) return true

			const tieneRol = payload.codigo_roles.some(rol =>
				codigosRoles.includes(rol),
			)

			return tieneRol
		},
		[codigosRoles],
	)

	useEffect(() => {
		obtenerSesion()
			.then(payload => setPermitido(validar(payload)))
			.catch(() => setPermitido(false))
	}, [validar])

	if (!permitido) return null

	return <>{children}</>
}
