'use client'

import { ObtenerRegistrosAuditoriaResponse } from '@/aplicacion/auditoria/dtos/obtener-registros-auditoria-response'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs'
import RegistroAuditoria from '@/dominio/registro-auditoria/registro-auditoria'
import { useExportarAuditoria } from '@/hooks/auditoria/use-exportar-auditoria'
import { useRegistrosAuditoria } from '@/hooks/auditoria/use-registros-auditoria'
import { useDebounce } from '@/hooks/use-debounce'
import { useState } from 'react'
import DialogDetalleRegistro from './dialog-detalle-registro'
import FiltrosAuditoria from './filtros-auditoria'
import TablaRegistrosAuditoria from './tabla-registros-auditoria'

type TabAuditoria = 'AUTENTICACION' | 'ACCION_NEGOCIO' | 'TODAS'

type AuditoriaClientProps = {
	initialData: ObtenerRegistrosAuditoriaResponse
}

export default function AuditoriaClient({ initialData }: AuditoriaClientProps) {
	const [tab, setTab] = useState<TabAuditoria>('TODAS')
	const categoria = tab === 'TODAS' ? null : tab

	const [pagina, setPagina] = useState(1)
	const [inputBusqueda, setInputBusqueda] = useState('')
	const textoBusqueda = useDebounce(inputBusqueda, 300)
	const [evento, setEvento] = useState<string | null>(null)
	const [inputIp, setInputIp] = useState('')
	const ipOrigen = useDebounce(inputIp, 300)
	const [fechaDesde, setFechaDesde] = useState<string | null>(null)
	const [fechaHasta, setFechaHasta] = useState<string | null>(null)
	const [registroSeleccionado, setRegistroSeleccionado] =
		useState<RegistroAuditoria | null>(null)

	const {
		data: respuesta,
		isFetching,
		refetch,
	} = useRegistrosAuditoria({
		initialData,
		categoria,
		evento,
		textoBusqueda,
		fechaDesde,
		fechaHasta,
		ipOrigen,
		pagina,
	})

	const exportarMutation = useExportarAuditoria()

	const cambiarTab = (valor: string) => {
		setTab(valor as TabAuditoria)
		setPagina(1)
		setEvento(null)
	}

	const exportarCsv = () => {
		exportarMutation.mutate({
			categoria,
			evento,
			textoBusqueda,
			fechaDesde,
			fechaHasta,
			ipOrigen,
		})
	}

	return (
		<PanelLayout>
			<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border/80 p-3 sm:p-4'>
					<Tabs value={tab} onValueChange={cambiarTab}>
						<TabsList>
							<TabsTrigger value='AUTENTICACION'>Conexiones</TabsTrigger>
							<TabsTrigger value='ACCION_NEGOCIO'>
								Acciones de negocio
							</TabsTrigger>
							<TabsTrigger value='TODAS'>Todas</TabsTrigger>
						</TabsList>
					</Tabs>

					<div className='mt-3'>
						<FiltrosAuditoria
							categoria={categoria}
							busqueda={inputBusqueda}
							onBusquedaChange={valor => {
								setInputBusqueda(valor)
								setPagina(1)
							}}
							evento={evento}
							onEventoChange={valor => {
								setEvento(valor)
								setPagina(1)
							}}
							fechaDesde={fechaDesde}
							onFechaDesdeChange={valor => {
								setFechaDesde(valor)
								setPagina(1)
							}}
							fechaHasta={fechaHasta}
							onFechaHastaChange={valor => {
								setFechaHasta(valor)
								setPagina(1)
							}}
							ipOrigen={inputIp}
							onIpOrigenChange={valor => {
								setInputIp(valor)
								setPagina(1)
							}}
							total={respuesta?.total || 0}
							totalFiltrados={respuesta?.data.length || 0}
							onActualizar={() => refetch()}
							actualizando={isFetching}
							onExportar={exportarCsv}
							exportando={exportarMutation.isPending}
						/>
					</div>
				</div>

				<div className='p-3 sm:p-4'>
					<TablaRegistrosAuditoria
						registros={respuesta?.data || []}
						isFetching={isFetching}
						pagina={pagina}
						totalPaginas={respuesta?.total_paginas || 0}
						onPaginaChange={setPagina}
						onVerDetalle={setRegistroSeleccionado}
					/>
				</div>
			</section>

			<DialogDetalleRegistro
				registro={registroSeleccionado}
				cerrarDialog={() => setRegistroSeleccionado(null)}
			/>
		</PanelLayout>
	)
}
