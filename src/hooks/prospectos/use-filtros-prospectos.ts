import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { EstadoComercialProspecto } from '@/types/estados/estado-comercial-cliente'
import { useCallback, useMemo, useState } from 'react'

export type FiltroEstadoComercialValor = EstadoComercialProspecto | 'todos'

export const useFiltrosProspectos = (prospectos?: ProspectoResumenJson[]) => {
	const [filtro, setFiltro] = useState<FiltroEstadoComercialValor>('todos')

	const cambiarFiltro = useCallback(
		(value: FiltroEstadoComercialValor) => setFiltro(value),
		[],
	)

	const prospectosFiltrados = useMemo(() => {
		console.log(prospectos)
		if (!prospectos) return []
		if (filtro === 'todos') return [...prospectos]

		return prospectos.filter(prospecto => prospecto.codigo_estado === filtro)
	}, [filtro, prospectos])

	const contarFiltro = useCallback(
		(value: FiltroEstadoComercialValor): number => {
			console.log('contando filtros')
			if (value === 'todos') return prospectos?.length ?? 0

			return (
				prospectos?.reduce((acc, prospecto) => {
					return prospecto.codigo_estado === value ? acc + 1 : acc + 0
				}, 0) ?? 0
			)
		},
		[prospectos],
	)

	return { filtro, cambiarFiltro, prospectosFiltrados, contarFiltro }
}
