import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const useAuth = () => {
	const [cargando, setCargando] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const router = useRouter()

	const login = async (rut: string, password: string) => {
		try {
			setCargando(true)
			setError(null)

			await axios.post('/api/auth/login', {
				rut,
				password,
			})

			// Refrescar server components para actualizar cookies
			router.replace('/')
			router.refresh()
		} catch {
			setError('Credenciales inválidas')
		} finally {
			setCargando(false)
		}
	}

	const logout = async () => {
		try {
			await axios.post('/api/auth/logout')

			router.replace('/login')
			router.refresh()
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
