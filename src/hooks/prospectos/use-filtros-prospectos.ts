import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { EstadoComercialProspecto } from '@/types/estados/estado-comercial-cliente'
import { useMemo, useState } from 'react'
import { useFiltrarProspectos } from './use-filtrar-prospectos'

export type FiltroEstadoComercialValor = EstadoComercialProspecto | 'todos'

export const useFiltrosProspectos = (prospectos?: ProspectoResumenJson[]) => {
	const [filtro, setFiltro] = useState<FiltroEstadoComercialValor>('todos')

	const cambiarFiltro = (value: FiltroEstadoComercialValor) => setFiltro(value)

	const { filtrar } = useFiltrarProspectos(prospectos)

	const prospectosFiltrados = useMemo(() => filtrar(filtro), [filtro, filtrar])

	const filtrosContados = useMemo<Map<EstadoComercialProspecto, number>>(() => {
		const contados = new Map<EstadoComercialProspecto, number>([
			['COTIZACION_DISPONIBLE', 0],
			['CONTACTADO', 0],
			['ESTUDIO_DISPONIBLE', 0],
			['RECOTIZACION_SOLICITADA', 0],
			['CLIENTE_CARGADO_MASIVO', 0],
			['GANADO', 0],
			['PERDIDO', 0],
			['COTIZACION_SOLICITADA_COMPANY', 0],
			['ESTUDIO_ENVIADO_CLIENTE', 0],
			['EJECUTIVO_COMERCIAL_ASIGNADO', 0],
			['OPORTUNIDAD_CREADA', 0],
			['PROPUESTA_ACEPTADA', 0],
			['POLIZA_REGISTRADA', 0],
			['PLAN_PAGO_CREADO', 0],
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
		filtrosContados,
	}
}
