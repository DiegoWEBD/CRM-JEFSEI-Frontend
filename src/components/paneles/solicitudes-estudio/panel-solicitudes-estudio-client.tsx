'use client'

import { ObtenerTodasSolicitudesCotizacionResponse } from '@/aplicacion/solicitudes-cotizacion/use-cases/obtener-todas-solicitudes-cotizacion/dto/obtener-todas-solicitudes-cotizacion-response'
import Paginacion from '@/components/paginacion/paginacion'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { PanelSolicitudesEstudioSkeleton } from '@/components/paneles/solicitudes-estudio/panel-solicitudes-estudio-skeleton'
import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'
import { useObtenerTodasSolicitudesCotizacion } from '@/hooks/solicitudes-cotizacion/use-obtener-todas-solicitudes-cotizacion'
import { TAMANO_PAGINA } from '@/hooks/solicitudes-cotizacion/query-key-solicitudes-panel'
import { useDebounce } from '@/hooks/use-debounce'
import { useState } from 'react'
import FiltrosSolicitudesEstudio, {
	FILTROS_POR_DEFECTO,
	TODOS,
	type FiltrosSolicitudes,
} from './filtros-solicitudes-estudio'
import KpiSolicitudesEstudio, {
	type TarjetaActiva,
} from './kpi-solicitudes-estudio'
import SheetDetalleSolicitud from './sheet-detalle-solicitud'
import TablaSolicitudesEstudio from './tabla-solicitudes-estudio'

type PanelSolicitudesEstudioClientProps = {
	initialData: ObtenerTodasSolicitudesCotizacionResponse
}

export default function PanelSolicitudesEstudioClient({
	initialData,
}: PanelSolicitudesEstudioClientProps) {
	const [detalleAbierto, setDetalleAbierto] =
		useState<SolicitudCotizacionResumen | null>(null)
	const [pagina, setPagina] = useState(1)
	const [filtros, setFiltros] = useState<FiltrosSolicitudes>({
		...FILTROS_POR_DEFECTO,
	})
	const textoBusqueda = useDebounce(filtros.busqueda, 300)

	const {
		data: respuesta,
		isLoading,
		isFetching,
		error,
	} = useObtenerTodasSolicitudesCotizacion(
		{
			textoBusqueda,
			estado: filtros.estado === TODOS ? '' : filtros.estado,
			prioridad: filtros.prioridad === TODOS ? '' : filtros.prioridad,
			rutUsuario: filtros.rutUsuario,
			pagina,
			tamanoPagina: TAMANO_PAGINA,
		},
		initialData,
	)

	const actualizarFiltros = (nuevos: FiltrosSolicitudes) => {
		setFiltros(nuevos)
		setPagina(1)
	}

	const tarjetaActiva: TarjetaActiva =
		filtros.estado === TODOS ? 'todas' : (filtros.estado as TarjetaActiva)

	// El KPI ya resuelve el alternado: entrega la tarjeta resultante.
	const onToggleTarjeta = (key: TarjetaActiva) => {
		actualizarFiltros({
			...filtros,
			estado: key === 'todas' ? TODOS : key,
		})
	}

	if (isLoading) return <PanelSolicitudesEstudioSkeleton />
	if (error)
		return (
			<div className='flex items-center justify-center py-12'>
				<p className='text-sm text-muted-foreground'>
					Error al cargar solicitudes.
				</p>
			</div>
		)

	const solicitudes = respuesta?.data ?? []

	return (
		<>
			<PanelLayout>
				<KpiSolicitudesEstudio
					contadores={
						respuesta?.contadores ?? {
							informacion_incompleta: 0,
							listas_para_cotizar: 0,
							cotizaciones_emitidas: 0,
							estudios_emitidos: 0,
						}
					}
					tarjetaActiva={tarjetaActiva}
					onToggleTarjeta={onToggleTarjeta}
				/>

				<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
					<div className='border-b border-border/80 p-3 sm:p-4'>
						<FiltrosSolicitudesEstudio
							filtros={filtros}
							onChange={actualizarFiltros}
							total={respuesta?.total ?? 0}
							filtrados={solicitudes.length}
						/>
					</div>

					<div className='p-3 sm:p-4'>
						<TablaSolicitudesEstudio
							solicitudes={solicitudes}
							isFetching={isFetching}
							onVerDetalle={setDetalleAbierto}
							textoResaltado={textoBusqueda}
						/>
						<Paginacion
							pagina={pagina}
							totalPaginas={respuesta?.total_paginas ?? 1}
							onPaginaChange={setPagina}
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
