import Poliza from '@/dominio/poliza/poliza'
import { PolizasPorProducto } from './dto/polizas-por-producto'
import { useMemo } from 'react'

export const useAgruparPolizasPorProducto = (polizas?: Poliza[]) => {
	const polizasPorProductos = useMemo<PolizasPorProducto[]>(() => {
		if (!polizas) return []

		const dictPolizas: Map<string, PolizasPorProducto> = new Map()

		for (const poliza of polizas) {
			if (!dictPolizas.get(poliza.nombre_producto))
				dictPolizas.set(poliza.nombre_producto, {
					producto: poliza.nombre_producto,
					polizas: [],
				})

			dictPolizas.get(poliza.nombre_producto)?.polizas.push(poliza)
		}

		return dictPolizas.values().toArray()
	}, [polizas])

	return { polizasPorProductos }
}
