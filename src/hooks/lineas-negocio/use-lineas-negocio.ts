import { obtenerLineasNegocio } from '@/aplicacion/linea-negocio/use-cases/obtener-lineas-negocio'
import LineaNegocio from '@/dominio/linea-negocio/linea-negocio'
import { AxiosError } from 'axios'
import { useCallback, useState } from 'react'

export const useLineasNegocio = () => {
	const [lineasNegocio, setLineasNegocio] = useState<LineaNegocio[]>([])
	const [cargando, setCargando] = useState<boolean>(false)
	const [error, setError] = useState<string | undefined>(undefined)

	const cargarLineasNegocio = useCallback(() => {
		setCargando(true)

		obtenerLineasNegocio()
			.then(setLineasNegocio)
			.catch((err: AxiosError) => setError(err.message))
			.finally(() => setCargando(false))
	}, [])

	return {
		lineasNegocio,
		cargando,
		error,
		cargarLineasNegocio,
	}
}
