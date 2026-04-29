import { IniciarSesionResponse } from '@/aplicacion/auth/dtos/iniciar-sesion-response'
import { useAuthStore } from '@/global_states/auth_store'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const useAuth = () => {
	const [cargando, setCargando] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const router = useRouter()

	const loginStore = useAuthStore(state => state.login)
	const logoutStore = useAuthStore(state => state.logout)

	const login = async (rut: string, password: string) => {
		try {
			setCargando(true)
			setError(null)

			const response = await axios.post('/api/auth/login', { rut, password })

			const data: IniciarSesionResponse = response.data
			console.log(data)

			loginStore(data.usuario, data.expire_minutes)

			router.replace('/')
		} catch {
			setError('Credenciales inválidas')
		} finally {
			setCargando(false)
		}
	}

	const logout = async () => {
		try {
			await axios.post('/api/auth/logout')

			logoutStore()

			router.replace('/login')
		} catch {
			console.error('Error al cerrar sesión')
		}
	}

	return {
		cargando,
		error,
		login,
		logout,
	}
}
