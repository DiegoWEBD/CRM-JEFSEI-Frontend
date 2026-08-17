import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { EstadoGeneralCliente } from '@/lib/estados-cotizaciones'
import { EstadoComercialProspecto } from '@/types/estados/estado-comercial-cliente'
import { useCallback, useMemo } from 'react'

export type FiltroEstadoValor =
	| EstadoComercialProspecto
	| EstadoGeneralCliente
	| 'todos'

export function useFiltrarProspectos(prospectos?: ProspectoResumenJson[]) {
	const filtrar = useCallback(
		(filtro: FiltroEstadoValor): ProspectoResumenJson[] => {
			console.log(filtro)
			if (!prospectos) return []
			if (filtro === 'todos') return [...prospectos]

			return prospectos.filter(
				prospecto =>
					prospecto.procesos_comerciales.some(
						proceso => proceso.codigo_estado === filtro,
					) || prospecto.estado_general_cliente === filtro,
			)
		},
		[prospectos],
	)

	return useMemo(() => ({ filtrar }), [filtrar])
}
