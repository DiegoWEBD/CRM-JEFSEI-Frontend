'use client'

import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { PanelSolicitudesEstudioSkeleton } from '@/components/paneles/solicitudes-estudio/panel-solicitudes-estudio-skeleton'
import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'
import { useObtenerTodasSolicitudesCotizacion } from '@/hooks/solicitudes-cotizacion/use-obtener-todas-solicitudes-cotizacion'
import { useMemo, useState } from 'react'
import FiltrosSolicitudesEstudio, {
	TODOS,
	type FiltrosSolicitudes,
} from './filtros-solicitudes-estudio'
import KpiSolicitudesEstudio, {
	type TarjetaActiva,
} from './kpi-solicitudes-estudio'
import SheetDetalleSolicitud from './sheet-detalle-solicitud'
import TablaSolicitudesEstudio from './tabla-solicitudes-estudio'

function resolverEstado(s: SolicitudCotizacionResumen): string {
	if (!s.informacion_completa) return 'informacion_incompleta'
	if (s.estudio_disponible) return 'estudio_emitido'
	if (s.cantidad_cotizaciones > 0) return 'con_cotizaciones'
	return 'lista_para_cotizar'
}

function buildConteos(
	solicitudes: SolicitudCotizacionResumen[],
): Record<string, number> {
	const conteos: Record<string, number> = {
		informacion_incompleta: 0,
		lista_para_cotizar: 0,
		con_cotizaciones: 0,
		estudio_emitido: 0,
	}
	for (const s of solicitudes) {
		const estado = resolverEstado(s)
		conteos[estado] = (conteos[estado] ?? 0) + 1
	}
	return conteos
}

function solicitudMatchesBusqueda(
	s: SolicitudCotizacionResumen,
	q: string,
): boolean {
	if (!q) return true
	const term = q.toLowerCase()
	return (
		s.nombre_riesgo.toLowerCase().includes(term) ||
		s.ejecutivo_comercial.toLowerCase().includes(term) ||
		s.producto.toLowerCase().includes(term)
	)
}

function filaCoincideTarjeta(estado: string, tarjeta: TarjetaActiva): boolean {
	if (tarjeta === 'todas') return true
	return estado === tarjeta
}

export default function PanelSolicitudesEstudioClient() {
	const {
		data: solicitudes,
		isLoading,
		error,
	} = useObtenerTodasSolicitudesCotizacion()

	const [detalleAbierto, setDetalleAbierto] =
		useState<SolicitudCotizacionResumen | null>(null)

	const [tarjetaActiva, setTarjetaActiva] = useState<TarjetaActiva>('todas')
	const [filtros, setFiltros] = useState<FiltrosSolicitudes>({
		busqueda: '',
		estado: TODOS,
		prioridad: TODOS,
		ejecutivo: TODOS,
		linea: TODOS,
	})

	const conteos = useMemo(
		() => (solicitudes ? buildConteos(solicitudes) : {}),
		[solicitudes],
	)

	const opcionesEjecutivo = useMemo(
		() =>
			solicitudes
				? [...new Set(solicitudes.map(s => s.ejecutivo_comercial))].sort()
				: [],
		[solicitudes],
	)

	const opcionesLinea = useMemo(
		() =>
			solicitudes ? [...new Set(solicitudes.map(s => s.producto))].sort() : [],
		[solicitudes],
	)

	const listaFiltrada = useMemo(() => {
		if (!solicitudes) return []
		const rows = solicitudes.filter(s => {
			if (!solicitudMatchesBusqueda(s, filtros.busqueda)) return false
			const estado = resolverEstado(s)
			if (!filaCoincideTarjeta(estado, tarjetaActiva)) return false
			if (filtros.estado !== TODOS && estado !== filtros.estado) return false
			if (filtros.prioridad !== TODOS && s.prioridad !== filtros.prioridad)
				return false
			if (
				filtros.ejecutivo !== TODOS &&
				s.ejecutivo_comercial !== filtros.ejecutivo
			)
				return false
			if (filtros.linea !== TODOS && s.producto !== filtros.linea) return false
			return true
		})
		return rows
	}, [solicitudes, filtros, tarjetaActiva])

	if (isLoading) return <PanelSolicitudesEstudioSkeleton />
	if (error)
		return (
			<div className='flex items-center justify-center py-12'>
				<p className='text-sm text-muted-foreground'>
					Error al cargar solicitudes.
				</p>
			</div>
		)

	return (
		<>
			<PanelLayout>
				<KpiSolicitudesEstudio
					conteos={conteos}
					tarjetaActiva={tarjetaActiva}
					onToggleTarjeta={setTarjetaActiva}
				/>

				<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
					<div className='border-b border-border/80 p-3 sm:p-4'>
						<FiltrosSolicitudesEstudio
							filtros={filtros}
							onChange={setFiltros}
							opcionesEjecutivo={opcionesEjecutivo}
							opcionesLinea={opcionesLinea}
							total={solicitudes?.length ?? 0}
							filtrados={listaFiltrada.length}
						/>
					</div>

					<div className='p-3 sm:p-4'>
						<TablaSolicitudesEstudio
							solicitudes={listaFiltrada}
							onVerDetalle={setDetalleAbierto}
						/>
					</div>
				</section>
			</PanelLayout>

			<SheetDetalleSolicitud
				solicitud={detalleAbierto}
				open={!!detalleAbierto}
				onOpenChange={open => {
					if (!open) setDetalleAbierto(null)
				}}
			/>
		</>
	)
}
