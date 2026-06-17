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
		if (!prospectos) return []
		if (filtro === 'todos') return [...prospectos]

		return prospectos.filter(prospecto => {
			for (const proceso of prospecto.procesos_comerciales)
				if (proceso.codigo_estado === filtro) return true

			return false
		})
	}, [filtro, prospectos])

	const contarFiltro = useCallback(
		(value: FiltroEstadoComercialValor): number => {
			if (value === 'todos') return prospectos?.length ?? 0

			/*return (
				prospectos?.reduce((acc, prospecto) => {
					return prospecto.codigo_estado === value ? acc + 1 : acc + 0
				}, 0) ?? 0
			)*/
			return 2
		},
		[prospectos],
	)

	const filtrosContados = useMemo<Map<EstadoComercialProspecto, number>>(() => {
		const contados = new Map<EstadoComercialProspecto, number>([
			['NUEVO', 0],
			['EJECUTIVO_COMERCIAL_ASIGNADO', 0],
			['CONTACTADO', 0],
			['ESTUDIO_EN_DESARROLLO', 0],
			['COTIZACION_SOLICITADA_COMPANY', 0],
			['ESTUDIO_DISPONIBLE', 0],
			['ESTUDIO_ENVIADO_CLIENTE', 0],
			['RECOTIZACION_SOLICITADA', 0],
			['GANADO', 0],
			['PERDIDO', 0],
		])

		if (!prospectos) return contados

		for (const prospecto of prospectos) {
			for (const proceso of prospecto.procesos_comerciales) {
				if (contados.get(proceso.codigo_estado) === undefined)
					contados.set(proceso.codigo_estado, 0)
				contados.set(
					proceso.codigo_estado,
					contados.get(proceso.codigo_estado)! + 1,
				)
			}
		}

		return contados
	}, [prospectos])

	return {
		filtro,
		cambiarFiltro,
		prospectosFiltrados,
		contarFiltro,
		filtrosContados,
	}
}
