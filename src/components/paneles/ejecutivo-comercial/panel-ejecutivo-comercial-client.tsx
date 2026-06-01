'use client'

import { ClipboardList, FileText, UserCheck, Users } from 'lucide-react'
import { useState } from 'react'

import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import CardCalendario from '@/components/card-calendario/card-calendario'
import CardComunicadoGerencia from '@/components/card-comunicado-gerencia/card-comunicado-gerencia'
import { SolicitudEstudioDto } from '@/dtos/evaluacion-proyectos/solicitud-estudio/solicitud-estudio-dto'
import { DatosKpi } from '@/hooks/kpi/dto/datos-kpi'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'
import { EstudioEmitidoRegistro } from '@/types/evaluacion-proyectos/estudios-emitidos/estudio-emitido-registro'
import {
	SharedReminder,
	SharedReminderStatus,
	SharedReminderType,
} from '@/types/shared/shared-reminders'
import { formatFechaCorta } from '@/utils/format-fecha-corta'
import CardProspectosClient from '../../prospectos/card-prospectos/card-prospectos-client'
import PanelFooter from '../panel-layout/panel-footer/panel-footer'
import PanelHeader from '../panel-layout/panel-header/panel-header'
import PanelLayout from '../panel-layout/panel-layout'
import CardKpi from './cards/card-kpi/card-kpi'

const SECTION =
	'text-sm font-semibold leading-tight tracking-tight text-foreground'

type PanelDetalleSecundario = 'clientes' | 'calendario' | null

const reminderStatusStyles: Record<SharedReminderStatus, string> = {
	atrasado: 'bg-destructive/15 text-destructive border-destructive/30',
	pendiente:
		'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700',
	realizado:
		'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
}

const reminderStatusLabel: Record<SharedReminderStatus, string> = {
	atrasado: 'Atrasado',
	pendiente: 'Pendiente',
	realizado: 'Completado',
}

const reminderTypeLabel: Record<SharedReminderType, string> = {
	llamada: 'Llamada',
	correo: 'Correo',
	visita: 'Visita',
	whatsapp: 'Mensaje',
	reunion: 'Visita',
	otro: 'General',
}

function etiquetaTipoRecordatorioItem(item: SharedReminder): string {
	if (item.categoria === 'seguimiento_futuro_cerrado_perdido') return 'General'
	if (item.categoria === 'general' && item.type === 'otro') return 'General'
	return reminderTypeLabel[item.type] ?? 'General'
}

function fechaYmd(date: Date) {
	const y = date.getFullYear()
	const m = String(date.getMonth() + 1).padStart(2, '0')
	const d = String(date.getDate()).padStart(2, '0')
	return `${y}-${m}-${d}`
}

type AvisoGerencia = {
	id: string
	titulo: string
	mensaje: string
	fecha: string
	prioridad: string
}

const AVISOS_GERENCIA: AvisoGerencia[] = [
	{
		id: 'ger-1',
		titulo: 'Nuevo procedimiento para solicitudes de estudio',
		mensaje:
			'Revisar que cada solicitud esté asociada a una línea de seguro antes de enviarla.',
		fecha: '18/05/2026',
		prioridad: 'Alta',
	},
	{
		id: 'ger-2',
		titulo: 'Reunión comercial',
		mensaje:
			'Hoy a las 16:00 se realizará una reunión breve de seguimiento comercial.',
		fecha: '18/05/2026',
		prioridad: 'Media',
	},
	{
		id: 'ger-3',
		titulo: 'Actualización de información de clientes',
		mensaje:
			'Gerencia solicita completar datos faltantes de clientes antes del viernes.',
		fecha: '18/05/2026',
		prioridad: 'Media',
	},
]

type EjecutivoComercialPanelClientProps = {
	prospectosIniciales: ProspectoResumenJson[]
}

export default function EjecutivoComercialPanelClient({
	prospectosIniciales,
}: EjecutivoComercialPanelClientProps) {
	//const { clientesPanel, getLineasCliente } = useClientesComercialesWorkspace()
	const registrosEstudiosEmitidos: EstudioEmitidoRegistro[] = []
	const solicitudesEjecutivo: SolicitudEstudioDto[] = []

	const { data: prospectos } = useObtenerProspectos(prospectosIniciales)

	/*const clientesEjecutivo = useMemo(
		() => clientesDelEjecutivoPanel(clientesPanel),
		[clientesPanel],
	)*/

	/*const kpi = useMemo(
		() =>
			calcularKpiEjecutivo({
				clientes: clientesPanel,
				solicitudesEjecutivo,
				getLineasCliente,
				registrosEstudiosEmitidos,
				solicitudTieneEstudioEmitido: tieneEstudioEmitidoRegistrado,
				referenciaDiaIso: hoyIso,
			}),
		[
			clientesPanel,
			solicitudesEjecutivo,
			getLineasCliente,
			registrosEstudiosEmitidos,
			tieneEstudioEmitidoRegistrado,
			hoyIso,
		],
	)*/

	const [kpiAbierto, setKpiAbierto] = useState<string | null>(null)
	const [panelSecundario, setPanelSecundario] =
		useState<PanelDetalleSecundario>(null)

	const defaultClienteRecordatorioId = ''

	/*const clientesConFiltroEstado = useMemo(
		() =>
			filtrarClientesPorEstadoComercial(
				clientesEjecutivo,
				filtroEstadoComercial,
			),
		[clientesEjecutivo, filtroEstadoComercial],
	)

	const conteosEstadoComercial = useMemo(
		() => conteosEstadoComercialPanel(clientesEjecutivo),
		[clientesEjecutivo],
	)

	const clientesFiltrados = useMemo(
		() => filtrarClientesBusquedaPanel(clientesConFiltroEstado, busqueda),
		[clientesConFiltroEstado, busqueda],
	)

	const clientesResultadoBusquedaOrdenados = useMemo(
		() =>
			[...clientesFiltrados].sort((a, b) => {
				const diff =
					prioridadOrdenEstadoComercial(a.estadoComercial) -
					prioridadOrdenEstadoComercial(b.estadoComercial)
				if (diff !== 0) return diff
				return a.nombre.localeCompare(b.nombre, 'es')
			}),
		[clientesFiltrados],
	)

	const mostrarResultadosFiltrados =
		filtroEstadoComercial !== 'todos' || busqueda.trim().length > 0

	const todosClientesEjecutivoOrdenados = useMemo(
		() =>
			[...clientesEjecutivo].sort((a, b) => {
				const score = (c: ClienteComercialPanelRow) => {
					if (c.asignacionPendienteRevision) return -1
					return prioridadOrdenEstadoComercial(c.estadoComercial)
				}
				const diff = score(a) - score(b)
				if (diff !== 0) return diff
				return a.nombre.localeCompare(b.nombre, 'es')
			}),
		[clientesEjecutivo],
	)

	const prospectosEjecutivo = useMemo(
		() => prospectosActivos(EJECUTIVO_COMERCIAL_PANEL),
		[prospectosData, prospectosActivos],
	)

	const idsClientesEjecutivo = useMemo(
		() => new Set(clientesEjecutivo.map(c => c.id)),
		[clientesEjecutivo],
	)

	const idsEntidadesEjecutivo = useMemo(() => {
		const ids = new Set(idsClientesEjecutivo)
		for (const p of prospectosEjecutivo) ids.add(p.id)
		return ids
	}, [idsClientesEjecutivo, prospectosEjecutivo])

	const prospectosFiltrados = useMemo(() => {
		const q = busqueda.trim().toLowerCase()
		if (!q) return []
		return prospectosEjecutivo.filter(p => {
			const blob = [
				p.nombre,
				p.rut ?? '',
				p.telefono ?? '',
				p.correo ?? '',
				ESTADO_PROSPECTO_LABELS[p.estado],
			]
				.join(' ')
				.toLowerCase()
			return blob.includes(q)
		})
	}, [prospectosEjecutivo, busqueda])

	const nombreClienteRecordatorio = useCallback(
		(clientId: string) => {
			const cliente = clientesEjecutivo.find(c => c.id === clientId)
			if (cliente) return cliente.nombre
			const prospecto = prospectosEjecutivo.find(p => p.id === clientId)
			return prospecto?.nombre ?? 'Contacto'
		},
		[clientesEjecutivo, prospectosEjecutivo],
	)

	useEffect(() => {
		for (const p of PENDIENTES_COMERCIAL_PANEL) {
			if (!idsClientesEjecutivo.has(p.clienteId)) continue
			if (reminders.some(r => r.id === p.id)) continue
			addReminder({
				id: p.id,
				clientId: p.clienteId,
				clienteNombre: nombreClienteRecordatorio(p.clienteId),
				ejecutivoId: EJECUTIVO_COMERCIAL_PANEL,
				title: p.tarea,
				date: p.vencimientoIso,
				time: '09:00',
				type: 'llamada',
				status: p.estado === 'vencido' ? 'atrasado' : 'pendiente',
				detail: `Prioridad ${p.prioridad}`,
				prioridad:
					p.prioridad === 'alta'
						? 'alta'
						: p.prioridad === 'baja'
							? 'baja'
							: 'normal',
			})
		}
	}, [idsClientesEjecutivo, reminders, addReminder, nombreClienteRecordatorio])*/

	/** Migra recordatorios del perfil que guardaron el nombre del formulario en ejecutivoId. */
	/*const recordatoriosMigradosRef = useRef(false)
	useEffect(() => {
		if (recordatoriosMigradosRef.current || idsClientesEjecutivo.size === 0)
			return
		for (const r of reminders) {
			if (!idsClientesEjecutivo.has(r.clientId)) continue
			if (r.ejecutivoId === EJECUTIVO_COMERCIAL_PANEL) continue
			updateReminder(r.id, {
				ejecutivoId: EJECUTIVO_COMERCIAL_PANEL,
				ejecutivoNombre:
					r.ejecutivoNombre ?? r.ejecutivoId ?? EJECUTIVO_COMERCIAL_PANEL,
			})
		}
		recordatoriosMigradosRef.current = true
	}, [reminders, idsClientesEjecutivo, updateReminder])

	const recordatoriosFechaSeleccionada = useMemo(
		() =>
			reminders
				.filter(
					r =>
						recordatorioPerteneceEjecutivo(
							r,
							EJECUTIVO_COMERCIAL_PANEL,
							idsEntidadesEjecutivo,
						) && r.date === diaSeleccionado,
				)
				.sort((a, b) => {
					const statusWeight: Record<ReminderStatus, number> = {
						atrasado: 0,
						pendiente: 1,
						realizado: 2,
					}
					const statusDiff = statusWeight[a.status] - statusWeight[b.status]
					if (statusDiff !== 0) return statusDiff
					return a.time.localeCompare(b.time)
				}),
		[reminders, diaSeleccionado, idsEntidadesEjecutivo],
	)

	const recordatoriosPorDia = useMemo(() => {
		const map = new Map<string, number>()
		for (const r of reminders) {
			if (
				!recordatorioPerteneceEjecutivo(
					r,
					EJECUTIVO_COMERCIAL_PANEL,
					idsEntidadesEjecutivo,
				)
			)
				continue
			map.set(r.date, (map.get(r.date) ?? 0) + 1)
		}
		return map
	}, [reminders, idsEntidadesEjecutivo])

	const actividadesCalendario = useMemo(() => {
		const actividadesClientes = clientesEjecutivo
			.filter(
				c => c.proximaAccionIso && c.proximaAccion && c.proximaAccion !== '—',
			)
			.map((c, index) => ({
				id: `cli-${c.id}`,
				fechaIso: c.proximaAccionIso,
				hora: index % 2 === 0 ? '10:30' : '15:00',
				titulo: c.proximaAccion,
				cliente: c.nombre,
				href: hrefPerfilEjecutivoComercial(c.id),
			}))

		const actividadesSolicitudes = solicitudesEjecutivo
			.filter(s => s.fechaRequeridaComercial)
			.map((s, index) => ({
				id: `sol-${s.id}`,
				fechaIso: s.fechaRequeridaComercial!,
				hora: index % 2 === 0 ? '09:00' : '16:00',
				titulo: 'Revisar estudio pendiente',
				cliente: s.cliente,
				href: '/solicitudes-estudio',
			}))

		return [...actividadesClientes, ...actividadesSolicitudes].sort((a, b) =>
			`${a.fechaIso} ${a.hora}`.localeCompare(`${b.fechaIso} ${b.hora}`),
		)
	}, [clientesEjecutivo, solicitudesEjecutivo])

	const actividadesPorDia = useMemo(() => {
		const map = new Map<string, typeof actividadesCalendario>()
		for (const actividad of actividadesCalendario) {
			const arr = map.get(actividad.fechaIso) ?? []
			arr.push(actividad)
			map.set(actividad.fechaIso, arr)
		}
		return map
	}, [actividadesCalendario])

	const diasCalendario = useMemo(() => {
		const hoy = new Date(`${hoyIso}T12:00:00`)
		const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
		const offsetLunes = (primerDiaMes.getDay() + 6) % 7
		const inicio = new Date(primerDiaMes)
		inicio.setDate(primerDiaMes.getDate() - offsetLunes)
		return Array.from({ length: 35 }, (_, i) => {
			const d = new Date(inicio)
			d.setDate(inicio.getDate() + i)
			const iso = fechaYmd(d)
			return {
				iso,
				dia: d.getDate(),
				esMesActual: d.getMonth() === hoy.getMonth(),
				esHoy: iso === hoyIso,
				tieneActividad:
					(actividadesPorDia.get(iso)?.length ?? 0) > 0 ||
					(recordatoriosPorDia.get(iso) ?? 0) > 0,
			}
		})
	}, [actividadesPorDia, recordatoriosPorDia, hoyIso])

	const actividadesDiaSeleccionado = useMemo(
		() => actividadesPorDia.get(diaSeleccionado) ?? [],
		[actividadesPorDia, diaSeleccionado],
	)

	const detalleKpi: PanelKpiDetalleDatos | null = useMemo(() => {
		if (!kpiAbierto) return null
		return datosDetalleKpi(kpiAbierto, {
			clientes: clientesPanel,
			solicitudesEjecutivo,
			getLineasCliente,
			registrosEstudiosEmitidos,
			solicitudTieneEstudioEmitido: tieneEstudioEmitidoRegistrado,
			referenciaDiaIso: hoyIso,
		})
	}, [
		kpiAbierto,
		clientesPanel,
		solicitudesEjecutivo,
		getLineasCliente,
		registrosEstudiosEmitidos,
		tieneEstudioEmitidoRegistrado,
		hoyIso,
	])

	const tarjetasResumen: TarjetaKpi[] = [
		{
			key: 'asignados',
			label: 'Clientes asignados',
			value: kpi.clientesAsignados,
			icon: UserCheck,
			bellNuevosSinRevisar: kpi.clientesAsignadosNuevosSinRevisar,
		},
		{
			key: 'cotiz',
			label: 'Cotizaciones solicitadas',
			value: kpi.cotizacionesSolicitadas,
			icon: ClipboardList,
		},
		{
			key: 'estDisp',
			label: 'Estudios disponibles',
			value: kpi.estudiosDisponibles,
			icon: FileText,
		},
		{
			key: 'activos',
			label: 'Clientes activos',
			value: kpi.clientesActivos,
			icon: Users,
		},
	]

	const resetReminderForm = useCallback(() => {
		setReminderForm({
			clientId: defaultClienteRecordatorioId,
			title: '',
			date: diaSeleccionado,
			time: '09:00',
			type: 'llamada',
			detail: '',
			status: 'pendiente',
			prioridad: 'normal',
		})
		setEditingReminderId(null)
	}, [defaultClienteRecordatorioId, diaSeleccionado])

	const abrirCrearRecordatorio = () => {
		resetReminderForm()
		setOpenReminderModal(true)
	}

	const handleAddReminder = useCallback(() => {
		const normalizedClientId =
			reminderForm.clientId || defaultClienteRecordatorioId
		if (!normalizedClientId) return
		const normalizedDate = reminderForm.date || diaSeleccionado
		const normalizedTitle = reminderForm.title.trim() || 'Recordatorio'
		const normalizedDetail = reminderForm.detail.trim() || 'Sin detalle'
		const clienteNombre = nombreClienteRecordatorio(normalizedClientId)
		const existente = editingReminderId
			? reminders.find(r => r.id === editingReminderId)
			: undefined
		const ahora = new Date().toISOString()
		const reminderPayload: Reminder = editingReminderId
			? {
					id: editingReminderId,
					...reminderForm,
					clientId: normalizedClientId,
					clienteNombre,
					ejecutivoId: EJECUTIVO_COMERCIAL_PANEL,
					ejecutivoNombre: EJECUTIVO_COMERCIAL_PANEL,
					date: normalizedDate,
					title: normalizedTitle,
					detail: normalizedDetail,
					policyId: undefined,
					fechaCreacion: existente?.fechaCreacion ?? ahora,
					categoria: existente?.categoria ?? 'general',
					panelEntidad:
						existente?.panelEntidad ??
						(normalizedClientId.startsWith('pros-') ? 'prospecto' : 'cliente'),
				}
			: {
					id: `rec-${Date.now()}`,
					...reminderForm,
					clientId: normalizedClientId,
					clienteNombre,
					ejecutivoId: EJECUTIVO_COMERCIAL_PANEL,
					ejecutivoNombre: EJECUTIVO_COMERCIAL_PANEL,
					date: normalizedDate,
					status: 'pendiente',
					title: normalizedTitle,
					detail: normalizedDetail,
					policyId: undefined,
					fechaCreacion: ahora,
					categoria: 'general',
					panelEntidad: normalizedClientId.startsWith('pros-')
						? 'prospecto'
						: 'cliente',
				}
		if (editingReminderId) {
			updateReminder(editingReminderId, reminderPayload)
		} else {
			addReminder(reminderPayload)
		}
		resetReminderForm()
		setOpenReminderModal(false)
	}, [
		addReminder,
		defaultClienteRecordatorioId,
		diaSeleccionado,
		editingReminderId,
		nombreClienteRecordatorio,
		reminders,
		reminderForm,
		resetReminderForm,
		updateReminder,
	])

	const handleEditReminder = useCallback(
		(reminderId: string) => {
			const reminder = reminders.find(item => item.id === reminderId)
			if (!reminder) return
			setEditingReminderId(reminder.id)
			setReminderForm({
				clientId: reminder.clientId,
				title: reminder.title,
				date: reminder.date,
				time: reminder.time,
				type: reminder.type,
				detail: reminder.detail,
				status: reminder.status,
				prioridad: prioridadRecordatorio(reminder),
			})
			setOpenReminderModal(true)
		},
		[reminders],
	)

	const handleCompleteReminder = useCallback(
		(reminderId: string) => {
			const item = reminders.find(r => r.id === reminderId)
			if (item?.categoria === 'seguimiento_comercial') {
				completarSeguimientoDesdeRecordatorio(
					reminderId,
					item.seguimientoLlamadaId,
				)
				return
			}
			updateReminder(reminderId, { status: 'realizado' })
		},
		[reminders, updateReminder],
	)

	const handleDeleteReminder = useCallback((reminderId: string) => {
		eliminarRecordatorioSeguimientoSiAplica(reminderId)
	}, [])*/

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
