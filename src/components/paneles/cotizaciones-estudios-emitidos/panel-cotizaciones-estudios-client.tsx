'use client'

import { useMemo, useState } from 'react'
import TituloPagina from '@/components/titulos/titulo-pagina'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'
import { PanelEstudioFila } from '@/aplicacion/cotizaciones-estudios/dto/panel-estudio-fila'
import { usePanelEstudios } from '@/hooks/cotizaciones-estudios/use-panel-estudios'
import KpiCotizacionesEstudios, {
	type TarjetaActiva,
} from './kpi-cotizaciones-estudios'
import FiltrosCotizacionesEstudios, {
	TODOS,
	type FiltrosPanel,
} from './filtros-cotizaciones-estudios'
import TablaCotizacionesEstudios from './tabla-cotizaciones-estudios'
import DialogVerCotizaciones from './dialog-ver-cotizaciones'
import DialogGenerarEstudio from './dialog-generar-estudio'
import DialogVerEstudio from './dialog-ver-estudio'

type DialogState =
	| { type: 'cotizaciones'; fila: PanelEstudioFila }
	| { type: 'generar-estudio'; fila: PanelEstudioFila }
	| { type: 'ver-estudio'; fila: PanelEstudioFila }
	| null

function buildConteos(filas: PanelEstudioFila[]): Record<string, number> {
	const conteos: Record<string, number> = {
		vigentes: 0,
		por_vencer: 0,
		vencidas: 0,
		estudios_pendientes: 0,
		estudios_finales: 0,
	}
	for (const f of filas) {
		if (f.estado_vencimiento === 'vigente') conteos.vigentes++
		else if (f.estado_vencimiento === 'por_vencer') conteos.por_vencer++
		else if (f.estado_vencimiento === 'vencida') conteos.vencidas++
		if (f.tiene_estudio) conteos.estudios_finales++
		else conteos.estudios_pendientes++
	}
	return conteos
}

function filaMatchesBusqueda(f: PanelEstudioFila, q: string): boolean {
	if (!q) return true
	const t = q.toLowerCase()
	return (
		f.cliente.toLowerCase().includes(t) ||
		f.ejecutivo_comercial.toLowerCase().includes(t) ||
		f.linea_seguro.toLowerCase().includes(t)
	)
}

type PanelCotizacionesEstudiosClientProps = {
	initialData: PanelEstudioFila[]
}

export default function PanelCotizacionesEstudiosClient({
	initialData,
}: PanelCotizacionesEstudiosClientProps) {
	const { data: filas, isFetching } = usePanelEstudios(initialData)

	const [dialog, setDialog] = useState<DialogState>(null)

	const [tarjetaActiva, setTarjetaActiva] = useState<TarjetaActiva>('todas')
	const [filtros, setFiltros] = useState<FiltrosPanel>({
		busqueda: '',
		estado_estudio: TODOS,
		prioridad: TODOS,
		ejecutivo: TODOS,
		linea: TODOS,
	})

	const data = filas ?? initialData

	const conteos = useMemo(() => buildConteos(data), [data])

	const opcionesEjecutivo = useMemo(
		() => [...new Set(data.map(f => f.ejecutivo_comercial))].sort(),
		[data],
	)

	const opcionesLinea = useMemo(
		() => [...new Set(data.map(f => f.linea_seguro))].sort(),
		[data],
	)

	const listaFiltrada = useMemo(() => {
		return data.filter(f => {
			if (!filaMatchesBusqueda(f, filtros.busqueda)) return false
			if (tarjetaActiva !== 'todas') {
				if (tarjetaActiva === 'vigentes' && f.estado_vencimiento !== 'vigente')
					return false
				if (
					tarjetaActiva === 'por_vencer' &&
					f.estado_vencimiento !== 'por_vencer'
				)
					return false
				if (tarjetaActiva === 'vencidas' && f.estado_vencimiento !== 'vencida')
					return false
				if (tarjetaActiva === 'estudios_pendientes' && f.tiene_estudio)
					return false
				if (tarjetaActiva === 'estudios_finales_emitidos' && !f.tiene_estudio)
					return false
			}
			if (filtros.estado_estudio !== TODOS) {
				const tieneEstudio = filtros.estado_estudio === 'disponible'
				if (f.tiene_estudio !== tieneEstudio) return false
			}
			if (filtros.prioridad !== TODOS && f.prioridad !== filtros.prioridad)
				return false
			if (
				filtros.ejecutivo !== TODOS &&
				f.ejecutivo_comercial !== filtros.ejecutivo
			)
				return false
			if (filtros.linea !== TODOS && f.linea_seguro !== filtros.linea)
				return false
			return true
		})
	}, [data, filtros, tarjetaActiva])

	const filaActual = dialog
		? (data.find(f => f.id === dialog.fila.id) ?? null)
		: null

	return (
		<PanelLayout>
			<PanelHeader>
				<TituloPagina>Cotizaciones Estudios Emitidos</TituloPagina>
			</PanelHeader>

			{isFetching && (
				<div className='mb-2 text-xs text-muted-foreground'>
					Actualizando...
				</div>
			)}

			<KpiCotizacionesEstudios
				conteos={conteos}
				tarjetaActiva={tarjetaActiva}
				onToggleTarjeta={setTarjetaActiva}
			/>

			<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
				<div className='space-y-3 border-b border-border/80 p-3 sm:p-4'>
					<FiltrosCotizacionesEstudios
						filtros={filtros}
						onChange={setFiltros}
						opcionesEjecutivo={opcionesEjecutivo}
						opcionesLinea={opcionesLinea}
						total={data.length}
						filtrados={listaFiltrada.length}
					/>
				</div>

				<div className='p-3 sm:p-4'>
					<TablaCotizacionesEstudios
						filas={listaFiltrada}
						isFetching={isFetching}
						onVerCotizaciones={f =>
							setDialog({ type: 'cotizaciones', fila: f })
						}
						onGenerarEstudio={f =>
							setDialog({ type: 'generar-estudio', fila: f })
						}
						onVerEstudio={f => setDialog({ type: 'ver-estudio', fila: f })}
					/>
				</div>
			</section>

			{dialog?.type === 'cotizaciones' && filaActual && (
				<DialogVerCotizaciones
					fila={filaActual}
					open
					onOpenChange={() => setDialog(null)}
				/>
			)}

			{dialog?.type === 'generar-estudio' && filaActual && (
				<DialogGenerarEstudio
					fila={filaActual}
					open
					onOpenChange={() => setDialog(null)}
				/>
			)}

			{dialog?.type === 'ver-estudio' && filaActual && (
				<DialogVerEstudio
					fila={filaActual}
					open
					onOpenChange={() => setDialog(null)}
				/>
			)}
		</PanelLayout>
	)
}
