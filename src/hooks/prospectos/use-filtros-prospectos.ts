import { useMemo } from 'react'

export const useFiltrosProspectos = (
	contadoresEstado?: Record<string, number>,
) => {
	const contadores = useMemo<Map<string, number>>(
		() => new Map(Object.entries(contadoresEstado ?? {})),
		[contadoresEstado],
	)

	return { contadores }
}
