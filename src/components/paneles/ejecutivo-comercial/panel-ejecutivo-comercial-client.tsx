'use client'

import { ClipboardList, FileText, UserCheck, Users } from 'lucide-react'
import { useState } from 'react'

import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import CardCalendario from '@/components/card-calendario/card-calendario'
import CardComunicadoGerencia from '@/components/card-comunicado-gerencia/card-comunicado-gerencia'
import { DatosKpi } from '@/hooks/kpi/dto/datos-kpi'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'
import { formatFechaCorta } from '@/utils/format-fecha-corta'
import CardProspectosClient from '../../prospectos/card-prospectos/card-prospectos-client'
import PanelFooter from '../panel-layout/panel-footer/panel-footer'
import PanelHeader from '../panel-layout/panel-header/panel-header'
import PanelLayout from '../panel-layout/panel-layout'
import CardKpi from './cards/card-kpi/card-kpi'
import MetricasEjecutivoComercial from './metricas-ejecutivo-comercial/metricas-ejecutivo-comercial'

type EjecutivoComercialPanelClientProps = {
	prospectosIniciales: ProspectoResumenJson[]
}

export default function EjecutivoComercialPanelClient({
	prospectosIniciales,
}: EjecutivoComercialPanelClientProps) {
	const { data: prospectos } = useObtenerProspectos(prospectosIniciales)

	const [kpiAbierto, setKpiAbierto] = useState<string | null>(null)

	const tarjetasResumen: DatosKpi[] = [
		{
			key: 'asignados',
			label: 'Clientes asignados',
			value: 7,
			icon: UserCheck,
			infoAdicional: 2,
		},
		{
			key: 'cotiz',
			label: 'Cotizaciones solicitadas',
			value: 3,
			icon: ClipboardList,
		},
		{
			key: 'estDisp',
			label: 'Estudios disponibles',
			value: 2,
			icon: FileText,
		},
		{
			key: 'activos',
			label: 'Clientes activos',
			value: 1,
			icon: Users,
		},
	]

	return (
		<PanelLayout>
			<PanelHeader>
				<MetricasEjecutivoComercial />
				<div className='grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4'>
					{tarjetasResumen.map(datos => (
						<CardKpi
							key={datos.key}
							datos={datos}
							setKpiAbierto={setKpiAbierto}
						/>
					))}
				</div>
				<CardProspectosClient prospectos={prospectos} />
			</PanelHeader>

			<CardCalendario prospectos={prospectos} />

			<PanelFooter>
				<CardComunicadoGerencia />
			</PanelFooter>

			{/*<PanelKpiDetalleSheet
				abierto={kpiAbierto != null}
				onOpenChange={open => {
					if (!open) setKpiAbierto(null)
				}}
				kpiKey={kpiAbierto}
				datos={detalleKpi}
			/>*/}

			{/*<Sheet
				open={panelSecundario != null}
				onOpenChange={open => !open && setPanelSecundario(null)}
			>
				<SheetContent className='w-full overflow-y-auto sm:max-w-2xl'>
					<SheetHeader>
						<SheetTitle>
							{panelSecundario === 'clientes'
								? 'Todos los clientes asignados'
								: 'Calendario'}
						</SheetTitle>
					</SheetHeader>

					{panelSecundario === 'clientes' ? (
						<div className='mt-4 overflow-x-auto rounded-md border border-border'>
							<Table>
								<TableHeader>
									<TableRow className='hover:bg-transparent'>
										<TableHead className='text-[10px] font-semibold uppercase text-muted-foreground'>
											Cliente
										</TableHead>
										<TableHead className='text-[10px] font-semibold uppercase text-muted-foreground'>
											Tipo
										</TableHead>
										<TableHead className='text-[10px] font-semibold uppercase text-muted-foreground'>
											Contacto
										</TableHead>
										<TableHead className='text-[10px] font-semibold uppercase text-muted-foreground'>
											Estado
										</TableHead>
										<TableHead className='text-right text-[10px] font-semibold uppercase text-muted-foreground'>
											Acción
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{prospectos.map(prospecto => (
										<FilaProspecto key={prospecto.id} prospecto={prospecto} />
									))}
								</TableBody>
							</Table>
						</div>
					) : null}

					{panelSecundario === 'calendario' ? (
						<div className='mt-4 space-y-2'>
							{actividadesCalendario.length === 0 ? (
								<p className='text-xs text-muted-foreground'>
									Sin actividades próximas.
								</p>
							) : (
								actividadesCalendario.map(a => (
									<Link
										key={a.id}
										href={a.href}
										className='block rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-muted/40'
									>
										<p className='font-medium text-foreground'>
											<span className='tabular-nums'>{a.hora}</span> {a.titulo}
										</p>
										<p className='text-xs text-muted-foreground'>
											{etiquetaDiaAgenda(a.fechaIso, hoyIso)} · {a.cliente}
										</p>
									</Link>
								))
							)}
						</div>
					) : null}
				</SheetContent>
			</Sheet>*/}
		</PanelLayout>
	)
}

/*
function RecordatorioDiaCard({
	item,
	clientName,
	onComplete,
	onEdit,
	onDelete,
}: {
	item: SharedReminder
	clientName: string
	onComplete: () => void
	onEdit: () => void
	onDelete: () => void
}) {
	const tipoLabel = etiquetaTipoRecordatorioItem(item)

	return (
		<div className='rounded-md border border-border bg-secondary/25 px-2 py-1.5'>
			<div className='flex items-start justify-between gap-1.5'>
				<p className='text-xs font-medium leading-snug text-foreground'>
					{item.title}
				</p>
				<Badge
					className={classname(
						'shrink-0 px-1 py-0 text-[9px]',
						reminderStatusStyles[item.status],
					)}
				>
					{reminderStatusLabel[item.status]}
				</Badge>
			</div>
			<p className='mt-0.5 text-[10px] leading-tight text-muted-foreground'>
				{clientName} · {tipoLabel} · {item.time}
			</p>
			{item.categoria === 'seguimiento_comercial' &&
			item.resultadoSeguimiento ? (
				<p className='mt-0.5 text-[10px] leading-tight text-muted-foreground'>
					Último resultado: {item.resultadoSeguimiento}
				</p>
			) : item.categoria !== 'seguimiento_comercial' ? (
				<p className='mt-0.5 line-clamp-2 text-[10px] leading-snug text-muted-foreground'>
					{item.detail}
				</p>
			) : null}
			<div className='mt-1 flex flex-wrap gap-1'>
				<Button
					size='sm'
					variant='outline'
					className='h-6 px-2 text-[10px]'
					onClick={onComplete}
				>
					Completar
				</Button>
				{item.categoria !== 'seguimiento_comercial' ? (
					<>
						<Button
							size='sm'
							variant='outline'
							className='h-6 px-2 text-[10px]'
							onClick={onEdit}
						>
							Editar
						</Button>
						<Button
							size='sm'
							variant='ghost'
							className='h-6 px-2 text-[10px] text-destructive hover:text-destructive'
							onClick={onDelete}
						>
							Eliminar
						</Button>
					</>
				) : null}
			</div>
		</div>
	)
}*/

function etiquetaDiaAgenda(fechaIso: string, hoyIso: string) {
	const fecha = new Date(`${fechaIso}T12:00:00`)
	const hoy = new Date(`${hoyIso}T12:00:00`)
	const diff = Math.round((fecha.getTime() - hoy.getTime()) / 86_400_000)

	if (diff === 0) return 'Hoy'
	if (diff === 1) return 'Mañana'
	if (diff === -1) return 'Ayer'

	return formatFechaCorta(fechaIso)
}
