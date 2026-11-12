'use client'

import { ObtenerPanelEstudiosResponse } from '@/aplicacion/cotizaciones-estudios/dto/obtener-panel-estudios-response'
import Paginacion from '@/components/paginacion/paginacion'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { usePanelEstudios } from '@/hooks/cotizaciones-estudios/use-panel-estudios'
import { TAMANO_PAGINA } from '@/hooks/cotizaciones-estudios/query-key-panel-estudios'
import { useDebounce } from '@/hooks/use-debounce'
import { useState } from 'react'
import FiltrosCotizacionesEstudios, {
	FILTROS_POR_DEFECTO,
	TODOS,
	type FiltrosPanel,
} from './filtros-cotizaciones-estudios'
import KpiCotizacionesEstudios, {
	type TarjetaActiva,
} from './kpi-cotizaciones-estudios'
import TablaCotizacionesEstudios from './tabla-cotizaciones-estudios'
import DialogVerCotizaciones from './dialog-ver-cotizaciones'
import { PanelEstudioFila } from '@/aplicacion/cotizaciones-estudios/dto/panel-estudio-fila'

type DialogState = { type: 'cotizaciones'; fila: PanelEstudioFila } | null

type PanelCotizacionesEstudiosClientProps = {
	initialData: ObtenerPanelEstudiosResponse
}

export default function PanelCotizacionesEstudiosClient({
	initialData,
}: PanelCotizacionesEstudiosClientProps) {
	const [dialog, setDialog] = useState<DialogState>(null)
	const [pagina, setPagina] = useState(1)
	const [filtros, setFiltros] = useState<FiltrosPanel>({
		...FILTROS_POR_DEFECTO,
	})
	const textoBusqueda = useDebounce(filtros.busqueda, 300)

	const {
		data: respuesta,
		isLoading,
		isFetching,
		error,
	} = usePanelEstudios(
		{
			textoBusqueda,
			estado: filtros.estado === TODOS ? '' : filtros.estado,
			prioridad: filtros.prioridad === TODOS ? '' : filtros.prioridad,
			rutEjecutivo: filtros.rutEjecutivo,
			pagina,
			tamanoPagina: TAMANO_PAGINA,
		},
		initialData,
	)

	const actualizarFiltros = (nuevos: FiltrosPanel) => {
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

	if (isLoading) {
		return (
			<PanelLayout>
				<KpiCotizacionesEstudios
					contadores={{
						cotizaciones_vigentes: 0,
						cotizaciones_por_vencer: 0,
						cotizaciones_vencidas: 0,
						estudios_pendientes: 0,
						estudios_emitidos: 0,
					}}
					tarjetaActiva='todas'
					onToggleTarjeta={() => {}}
					loading
				/>
			</PanelLayout>
		)
	}
	if (error)
		return (
			<div className='flex items-center justify-center py-12'>
				<p className='text-sm text-muted-foreground'>
					Error al cargar el panel de cotizaciones.
				</p>
			</div>
		)

	const filas = respuesta?.data ?? []

	return (
		<>
			<PanelLayout>
				<KpiCotizacionesEstudios
					contadores={
						respuesta?.contadores ?? {
							cotizaciones_vigentes: 0,
							cotizaciones_por_vencer: 0,
							cotizaciones_vencidas: 0,
							estudios_pendientes: 0,
							estudios_emitidos: 0,
						}
					}
					tarjetaActiva={tarjetaActiva}
					onToggleTarjeta={onToggleTarjeta}
				/>

				<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
					<div className='border-b border-border/80 p-3 sm:p-4'>
						<FiltrosCotizacionesEstudios
							filtros={filtros}
							onChange={actualizarFiltros}
							total={respuesta?.total ?? 0}
							filtrados={filas.length}
						/>
					</div>

					<div className='p-3 sm:p-4'>
						<TablaCotizacionesEstudios
							filas={filas}
							isFetching={isFetching}
							onVerCotizaciones={f =>
								setDialog({ type: 'cotizaciones', fila: f })
							}
						/>
						<Paginacion
							pagina={pagina}
							totalPaginas={respuesta?.total_paginas ?? 1}
							onPaginaChange={setPagina}
						/>
					</div>
				</section>
			</PanelLayout>

			{dialog?.type === 'cotizaciones' && (
				<DialogVerCotizaciones
					fila={dialog.fila}
					open
					onOpenChange={() => setDialog(null)}
				/>
			)}
		</>
	)
}
