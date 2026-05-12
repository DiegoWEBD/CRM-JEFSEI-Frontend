import { obtenerComunas } from '@/aplicacion/comunas/use-cases/obtener-comunas'
import Comuna from '@/dominio/comuna/comuna'
import { useCallback, useState } from 'react'

export const useComunas = () => {
	const [comunas, setComunas] = useState<Comuna[]>([])
	const [cargando, setCargando] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const cargarComunas = useCallback(() => {
		setCargando(true)

		obtenerComunas()
			.then(setComunas)
			.catch(err => setError(err.message))
			.finally(() => setCargando(false))
	}, [])

	return { comunas, cargando, error, cargarComunas }
}
