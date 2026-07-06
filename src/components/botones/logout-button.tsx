import { useAuth } from '@/hooks/auth/use-auth'
import { Button } from '@/components/button'
import { Loader2 } from 'lucide-react'

const LogoutButton = () => {
	const { logout, cargando } = useAuth()

	return (
		<Button onClick={logout} disabled={cargando}>
			{cargando && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
			{cargando ? 'Cerrando sesión...' : 'Cerrar sesión'}
		</Button>
	)
}

export default LogoutButton
