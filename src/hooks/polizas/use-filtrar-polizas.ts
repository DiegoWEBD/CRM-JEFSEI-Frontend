import Poliza from '@/dominio/poliza/poliza'
import { EstadoPoliza } from '@/lib/estados-cotizaciones'
import { useMemo, useState } from 'react'

export const useFiltrarPolizas = (polizas?: Poliza[]) => {
	const [filtro, setFiltro] = useState<EstadoPoliza | undefined>(undefined)

	const polizasFiltradas = useMemo(
		() =>
			polizas?.filter(
				poliza => filtro === undefined || filtro === poliza.estado,
			),
		[polizas, filtro],
	)

	const polizasPorEstado = useMemo<Map<EstadoPoliza, number>>(() => {
		const contadas = new Map<EstadoPoliza, number>([
			['REGISTRADA', 0],
			['VIGENTE', 0],
			['POR_VENCER', 0],
			['VENCIDA', 0],
			['CANCELADA', 0],
		])

		if (!polizas) return contadas

		polizas.forEach(poliza => {
			if (contadas.get(poliza.estado) === undefined)
				contadas.set(poliza.estado, 0)
			contadas.set(poliza.estado, contadas.get(poliza.estado)! + 1)
		})

		return contadas
	}, [polizas])

	const primaVigente = useMemo<number>(() => {
		if (!polizas) return 0

		return polizas.reduce(
			(prev, curr) =>
				prev +
				(curr.estado !== 'VENCIDA' && curr.estado !== 'CANCELADA'
					? curr.prima_neta
					: 0),
			0,
		)
	}, [polizas])

	return {
		polizasFiltradas,
		setFiltro,
		filtro,
		polizasPorEstado,
		primaVigente,
	}
}
