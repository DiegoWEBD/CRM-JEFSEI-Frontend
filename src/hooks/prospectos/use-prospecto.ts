import { ProspectoJson } from '@/aplicacion/prospectos/use-cases/obtener-prospecto/dto/prospecto-json'
import { obtenerProspecto } from '@/aplicacion/prospectos/use-cases/obtener-prospecto/obtener-prospecto'

import { AxiosError } from 'axios'
import { useCallback, useState } from 'react'

export const useProspecto = () => {
	const [prospecto, setProspecto] = useState<ProspectoJson | null>(null)
	const [cargando, setCargando] = useState<boolean>(false)
	const [error, setError] = useState<string | undefined>(undefined)

	const cargarProspecto = useCallback((id: number) => {
		setCargando(true)

		obtenerProspecto(id)
			.then(setProspecto)
			.catch((err: AxiosError) => setError(err.message))
			.finally(() => setCargando(false))
	}, [])

	return { prospecto, cargando, error, cargarProspecto }
}
