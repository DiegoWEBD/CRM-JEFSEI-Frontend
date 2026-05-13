import { getSession } from '@/lib/auth'
import HeaderUsuarioClient from '../header-usuario-client/header-usuario-client'

const HeaderUsuarioServer = async () => {
	const session = await getSession()

	if (!session) return null

	return (
		<HeaderUsuarioClient nombre={session.nombre} roles={session.nombre_roles} />
	)
}

export default HeaderUsuarioServer
