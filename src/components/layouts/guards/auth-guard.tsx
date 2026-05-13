import { getSession } from '@/lib/auth'
import { ReactNode } from 'react'

type AuthGuardProps = {
	children: ReactNode
	codigosRoles?: string[]
}

export default async function AuthGuard({
	children,
	codigosRoles = [],
}: AuthGuardProps) {
	const usuario = await getSession()

	if (!usuario) {
		return null
	}

	if (codigosRoles.length > 0) {
		const tieneRol = usuario.codigo_roles.some(rol =>
			codigosRoles.includes(rol),
		)

		if (!tieneRol) {
			return null
		}
	}

	return <>{children}</>
}
