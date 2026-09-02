'use client'

import type { ObtenerReportesResponse } from '@/aplicacion/procesos-comerciales/dto/obtener-reportes-response'
import type { ReporteProcesoComercial } from '@/aplicacion/procesos-comerciales/dto/reporte-proceso-comercial'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { useEtapasProcesoComerciales } from '@/hooks/procesos-comerciales/use-etapas-proceso-comerciales'
import { useReportesProcesosComerciales } from '@/hooks/procesos-comerciales/use-reportes-procesos-comerciales'
import { useDebounce } from '@/hooks/use-debounce'
import { useUsuarios } from '@/hooks/usuarios/use-usuarios'
import { useMemo, useState } from 'react'
import DetalleProcesoDrawer from './detalle-proceso-drawer'
import FiltrosProcesosComerciales, {
	TODOS,
	type FiltrosPanel,
} from './filtros-procesos-comerciales'
import KpiProcesosComerciales, {
	type ConteosProcesos,
	type TarjetaActiva,
} from './kpi-procesos-comerciales'
import TablaProcesosComerciales from './tabla-procesos-comerciales'

const TAMANO_PAGINA = 15

const ROLES_EJECUTIVO = [
	'EJECUTIVO_COMERCIAL',
	'EJECUTIVO_EVALUACION_PROYECTOS',
	'GERENTE_GENERAL',
	'GERENTE_COMERCIAL',
	'GERENTE_OPERACIONES',
]

type PanelProcesosComercialesClientProps = {
	initialData: ObtenerReportesResponse
}

export default function PanelProcesosComercialesClient({
	initialData,
}: PanelProcesosComercialesClientProps) {
	const [tarjetaActiva, setTarjetaActiva] = useState<TarjetaActiva>('abiertos')
	const [filtros, setFiltros] = useState<FiltrosPanel>({
		busqueda: '',
		ejecutivo: TODOS,
		etapa: TODOS,
		estadoComercial: TODOS,
	})
	const [pagina, setPagina] = useState(1)

	const textoBusqueda = useDebounce(filtros.busqueda, 300)

	const ejecutivosParam = useMemo(
		() => (filtros.ejecutivo !== TODOS ? [filtros.ejecutivo] : null),
		[filtros.ejecutivo],
	)

	const etapasParam = useMemo(
		() => (filtros.etapa !== TODOS ? [filtros.etapa] : null),
		[filtros.etapa],
	)

	const estadosComercialesParam = useMemo(
		() =>
			filtros.estadoComercial !== TODOS ? [filtros.estadoComercial] : null,
		[filtros.estadoComercial],
	)

	const cerradoParam = useMemo(() => {
		if (filtros.etapa === 'CERRADO') return true
		if (tarjetaActiva === 'abiertos') return false
		if (tarjetaActiva === 'ganados') return true
		if (tarjetaActiva === 'perdidos') return true
		if (tarjetaActiva === 'verde') return false
		if (tarjetaActiva === 'amarillo') return false
		if (tarjetaActiva === 'rojo') return false
		if (tarjetaActiva === 'todas') return null
		return null
	}, [tarjetaActiva, filtros.etapa])

	const estadoProcesoParam = useMemo(() => {
		if (tarjetaActiva === 'ganados') return 'ganados'
		if (tarjetaActiva === 'perdidos') return 'perdidos'
		return null
	}, [tarjetaActiva])

	const estadoSemaforoParam = useMemo(() => {
		if (tarjetaActiva === 'verde') return ['VERDE']
		if (tarjetaActiva === 'amarillo') return ['AMARILLO']
		if (tarjetaActiva === 'rojo') return ['ROJO']
		return null
	}, [tarjetaActiva])

	const { data: response, isFetching } = useReportesProcesosComerciales(
		initialData,
		textoBusqueda,
		ejecutivosParam,
		etapasParam,
		estadosComercialesParam,
		estadoSemaforoParam,
		estadoProcesoParam,
		cerradoParam,
		pagina,
		TAMANO_PAGINA,
	)

	const { data: usuariosData } = useUsuarios({ pagina: 1, tamano_pagina: 100 })
	const usuarios = usuariosData?.data
	const { data: etapas } = useEtapasProcesoComerciales()

	const [drawerAbierto, setDrawerAbierto] = useState(false)
	const [filaSeleccionada, setFilaSeleccionada] =
		useState<ReporteProcesoComercial | null>(null)

	const opcionesEjecutivo = useMemo(() => {
		if (!usuarios) return []
		return usuarios
			.filter(u => u.roles.some(r => ROLES_EJECUTIVO.includes(r.codigo)))
			.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
			.map(u => ({ rut: u.rut, nombre: u.nombre }))
	}, [usuarios])

	const opcionesEtapa = useMemo(
		() =>
			[...(etapas ?? [])].sort((a, b) =>
				a.nombre.localeCompare(b.nombre, 'es'),
			),
		[etapas],
	)

	const conteos: ConteosProcesos = useMemo(() => {
		const c = response?.contadores_estado ?? {}
		return {
			todas: c.todas ?? 0,
			abiertos: c.abiertos ?? 0,
			ganados: c.ganados ?? 0,
			perdidos: c.perdidos ?? 0,
			verde: c.verde ?? 0,
			amarillo: c.amarillo ?? 0,
			rojo: c.rojo ?? 0,
		}
	}, [response])

	const esConsultaInicial = useMemo(
		() =>
			textoBusqueda === '' &&
			filtros.ejecutivo === TODOS &&
			filtros.etapa === TODOS &&
			filtros.estadoComercial === TODOS &&
			tarjetaActiva === 'abiertos' &&
			pagina === 1,
		[
			textoBusqueda,
			filtros.ejecutivo,
			filtros.etapa,
			filtros.estadoComercial,
			tarjetaActiva,
			pagina,
		],
	)

	const handleChangeFiltros = (nuevosFiltros: FiltrosPanel) => {
		setFiltros(nuevosFiltros)
		setPagina(1)
	}

	const handleToggleTarjeta = (key: TarjetaActiva) => {
		setTarjetaActiva(key)
		setPagina(1)
	}

	const handleSeleccionar = (fila: ReporteProcesoComercial) => {
		setFilaSeleccionada(fila)
		setDrawerAbierto(true)
	}

	const data = useMemo(() => response?.data ?? [], [response])

	return (
		<PanelLayout>
			<KpiProcesosComerciales
				conteos={conteos}
				tarjetaActiva={tarjetaActiva}
				onToggleTarjeta={handleToggleTarjeta}
			/>

			<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border/80 p-3 sm:p-4'>
					<FiltrosProcesosComerciales
						filtros={filtros}
						onChange={handleChangeFiltros}
						opcionesEjecutivo={opcionesEjecutivo}
						opcionesEtapa={opcionesEtapa}
						total={response?.total ?? 0}
					/>
				</div>

				<div className='p-3 sm:p-4'>
					<TablaProcesosComerciales
						filas={data}
						isFetching={isFetching && !esConsultaInicial}
						onSeleccionar={handleSeleccionar}
						pagina={response?.pagina ?? 1}
						totalPaginas={response?.total_paginas ?? 0}
						onPaginaChange={setPagina}
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
