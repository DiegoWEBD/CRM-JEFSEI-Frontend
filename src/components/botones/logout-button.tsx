import { useAuth } from '@/hooks/auth/use-auth'
import { Button } from '@/components/button'

const LogoutButton = () => {
	const { logout } = useAuth()

	return <Button onClick={logout}>Cerrar sesión</Button>
}

export default LogoutButton
