import { getSession } from '@/lib/auth'
import HeaderClient from './header-client/header-client'

const Header = async () => {
	const session = await getSession()

	if (!session) return null

	return (
		<header className='sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md supports-backdrop-filter:bg-card/70'>
			<HeaderClient
				nombreUsuario={session.nombre}
				nombreRoles={session.nombre_roles}
			/>
		</header>
	)
}

export default Header
