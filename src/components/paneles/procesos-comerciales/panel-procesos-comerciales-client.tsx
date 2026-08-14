'use client'

import { useMemo, useState } from 'react'
import type {
	ReporteProcesoComercial,
	ReporteProcesoComercialAbierto,
} from '@/aplicacion/procesos-comerciales/dto/reporte-proceso-comercial'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { useReportesProcesosComerciales } from '@/hooks/procesos-comerciales/use-reportes-procesos-comerciales'
import KpiProcesosComerciales, {
	type TarjetaActiva,
	type ConteosProcesos,
} from './kpi-procesos-comerciales'
import FiltrosProcesosComerciales, {
	TODOS,
	type FiltrosPanel,
} from './filtros-procesos-comerciales'
import TablaProcesosComerciales from './tabla-procesos-comerciales'
import DetalleProcesoDrawer from './detalle-proceso-drawer'

function buildConteos(filas: ReporteProcesoComercial[]): ConteosProcesos {
	const conteos: ConteosProcesos = {
		todas: filas.length,
		abiertos: 0,
		ganados: 0,
		perdidos: 0,
		verde: 0,
		amarillo: 0,
		rojo: 0,
	}
	for (const f of filas) {
		if (!f.proceso.cerrado) conteos.abiertos++
		else if (f.proceso.estado_actual.codigo === 'GANADO') conteos.ganados++
		else if (f.proceso.estado_actual.codigo === 'PERDIDO') conteos.perdidos++

		if (!f.proceso.cerrado) {
			if (f.estado_semaforo === 'VERDE') conteos.verde++
			else if (f.estado_semaforo === 'AMARILLO') conteos.amarillo++
			else if (f.estado_semaforo === 'ROJO') conteos.rojo++
		}
	}
	return conteos
}

function filaMatchesBusqueda(f: ReporteProcesoComercial, q: string): boolean {
	if (!q) return true
	const t = q.toLowerCase()
	return (
		f.proceso.nombre_cliente.toLowerCase().includes(t) ||
		(f.proceso.ejecutivo_comercial?.nombre ?? '').toLowerCase().includes(t) ||
		f.proceso.producto.toLowerCase().includes(t)
	)
}

type PanelProcesosComercialesClientProps = {
	initialData: ReporteProcesoComercial[]
}

export default function PanelProcesosComercialesClient({
	initialData,
}: PanelProcesosComercialesClientProps) {
	const { data: reportes, isFetching } = useReportesProcesosComerciales(
		{},
		initialData,
	)

	const [drawerAbierto, setDrawerAbierto] = useState(false)
	const [filaSeleccionada, setFilaSeleccionada] =
		useState<ReporteProcesoComercial | null>(null)

	const [tarjetaActiva, setTarjetaActiva] = useState<TarjetaActiva>('abiertos')
	const [filtros, setFiltros] = useState<FiltrosPanel>({
		busqueda: '',
		ejecutivo: TODOS,
		etapa: TODOS,
	})

	const data = reportes ?? []

	const conteos = useMemo(() => buildConteos(data), [data])

	const opcionesEjecutivo = useMemo(
		() =>
			[
				...new Set(
					data
						.map(f => f.proceso.ejecutivo_comercial?.nombre ?? '')
						.filter(Boolean),
				),
			].sort(),
		[data],
	)

	const opcionesEtapa = useMemo(
		() => [...new Set(data.map(f => f.proceso.etapa_actual.nombre))].sort(),
		[data],
	)

	const listaFiltrada = useMemo(() => {
		return data.filter(f => {
			if (!filaMatchesBusqueda(f, filtros.busqueda)) return false

			if (tarjetaActiva !== 'todas') {
				if (tarjetaActiva === 'abiertos' && f.proceso.cerrado) return false
				if (
					tarjetaActiva === 'ganados' &&
					f.proceso.estado_actual.codigo !== 'GANADO'
				)
					return false
				if (
					tarjetaActiva === 'perdidos' &&
					f.proceso.estado_actual.codigo !== 'PERDIDO'
				)
					return false
				if (
					tarjetaActiva === 'verde' &&
					(f.proceso.cerrado || f.estado_semaforo !== 'VERDE')
				)
					return false
				if (
					tarjetaActiva === 'amarillo' &&
					(f.proceso.cerrado || f.estado_semaforo !== 'AMARILLO')
				)
					return false
				if (
					tarjetaActiva === 'rojo' &&
					(f.proceso.cerrado || f.estado_semaforo !== 'ROJO')
				)
					return false
			}

			if (filtros.ejecutivo !== TODOS) {
				if ((f.proceso.ejecutivo_comercial?.nombre ?? '') !== filtros.ejecutivo)
					return false
			}
			if (
				filtros.etapa !== TODOS &&
				f.proceso.etapa_actual.nombre !== filtros.etapa
			)
				return false

			return true
		})
	}, [data, filtros, tarjetaActiva])

	const handleSeleccionar = (fila: ReporteProcesoComercial) => {
		setFilaSeleccionada(fila)
		setDrawerAbierto(true)
	}

	return (
		<PanelLayout>
			<KpiProcesosComerciales
				conteos={conteos}
				tarjetaActiva={tarjetaActiva}
				onToggleTarjeta={setTarjetaActiva}
			/>

			<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border/80 p-3 sm:p-4'>
					<FiltrosProcesosComerciales
						filtros={filtros}
						onChange={setFiltros}
						opcionesEjecutivo={opcionesEjecutivo}
						opcionesEtapa={opcionesEtapa}
						total={data?.length ?? 0}
						filtrados={listaFiltrada.length}
					/>
				</div>

				<div className='p-3 sm:p-4'>
					<TablaProcesosComerciales
						filas={listaFiltrada}
						isFetching={isFetching}
						onSeleccionar={handleSeleccionar}
					/>
				</div>
			</section>

			<DetalleProcesoDrawer
				reporte={filaSeleccionada}
				open={drawerAbierto}
				onOpenChange={setDrawerAbierto}
			/>
		</PanelLayout>
	)
}
