import { iniciarSesion } from '@/aplicacion/auth/use-cases/iniciar-sesion'
import { useAuthStore } from '@/global_states/auth_store'
import { useState } from 'react'

export const useAuth = () => {
	const [cargando, setCargando] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const loginStore = useAuthStore(state => state.login)
	const logoutStore = useAuthStore(state => state.logout)

	const login = async (rut: string, password: string) => {
		try {
			setCargando(true)
			setError(null)

			const response = await iniciarSesion(rut, password)

			loginStore(response.access_token, response.usuario)
		} catch {
			setError('Credenciales inválidas')
		} finally {
			setCargando(false)
		}
	}

	const logout = () => {
		logoutStore()
	}

	return {
		cargando,
		error,
		login,
		logout,
	}
}
