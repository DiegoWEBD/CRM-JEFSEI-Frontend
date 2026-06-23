import { getSession } from '@/lib/auth'
import HeaderClient from './header-client/header-client'

const Header = async () => {
	const session = await getSession()

	if (!session) return null

	return (
		<header className='border-b border-border bg-card sticky top-0 z-50'>
			<HeaderClient
				nombreUsuario={session.nombre}
				nombreRoles={session.nombre_roles}
				codigoRoles={session.codigo_roles}
			/>
		</header>
	)
}

export default Header
