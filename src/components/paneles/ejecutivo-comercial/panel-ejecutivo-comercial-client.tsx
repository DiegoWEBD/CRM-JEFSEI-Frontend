'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
	Bell,
	CalendarDays,
	ClipboardList,
	FileText,
	Plus,
	Search,
	UserCheck,
	Users,
} from 'lucide-react'

import { SolicitudEstudioDto } from '@/dtos/evaluacion-proyectos/solicitud-estudio/solicitud-estudio-dto'
import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { KpiPanelDetalleKey } from '@/app/types/ejecutivo-comercial/panel/kpi-panel-detalle-key'
import { EstudioEmitidoRegistro } from '@/app/types/evaluacion-proyectos/estudios-emitidos/estudio-emitido-registro'
import { FiltroEstadoComercialValor } from '@/app/types/estados/estado-comercial-cliente'
import {
	SharedReminder,
	SharedReminderPriority,
	SharedReminderStatus,
	SharedReminderType,
} from '@/app/types/shared/shared-reminders'
import Calendario from '@/components/calendario/calendario'
import FilaProspecto from './cards/card-prospectos/fila-prospecto'
import Table from '@/components/table/table'
import TableHeader from '@/components/table/table-header/table-header'
import TableRow from '@/components/table/table-row/table-row'
import TableHead from '@/components/table/table-head/table-head'
import TableBody from '@/components/table/table-body/table-body'
import Sheet from '@/components/sheet/sheet'
import SheetContent from '@/components/sheet/sheet-content/sheet-content'
import SheetHeader from '@/components/sheet/sheet-header/sheet-header'
import SheetTitle from '@/components/sheet/sheet-title/sheet-title'
import CardContent from '@/components/card/card-content/card-content'
import Card from '@/components/card/card'
import { Badge } from '@/components/badge/badge'
import CardHeader from '@/components/card/card-header/card-header'
import CardTitle from '@/components/card/card-title/card-title'
import Button from '@/components/button/button'
import { formatFechaCorta } from '@/utils/format-fecha-corta'
import Dialog from '@/components/dialog/dialog'
import DialogContent from '@/components/dialog/dialog-content/dialog-content'
import DialogFooter from '@/components/dialog/dialog-footer/dialog-footer'
import Input from '@/components/forms/input/input'
import DialogHeader from '@/components/dialog/dialog-header/dialog-hedaer'
import DialogTitle from '@/components/dialog/dialog-title/dialog-title'
import DialogDescription from '@/components/dialog/dialog-description/dialog-description'
import Select from '@/components/forms/select/select'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import { classname } from '@/lib/class-name'
import Textarea from '@/components/forms/text-area/text-area'
import { PanelKpiDetalleDatos } from './panel-kpi-detalle-sheet'

const SECTION =
	'text-sm font-semibold leading-tight tracking-tight text-foreground'

type TarjetaKpi = {
	key: KpiPanelDetalleKey
	label: string
	value: number
	icon: LucideIcon
	bellNuevosSinRevisar?: number
}

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
	prospectos: ProspectoResumenJson[]
}

export default function EjecutivoComercialPanelClient({
	prospectos,
}: EjecutivoComercialPanelClientProps) {
	const searchParams = useSearchParams()
	//const { clientesPanel, getLineasCliente } = useClientesComercialesWorkspace()
	const registrosEstudiosEmitidos: EstudioEmitidoRegistro[] = []

	const hoyIso = useMemo(() => format(new Date(), 'yyyy-MM-dd'), [])
	const fechaHoy = useMemo(
		() => format(new Date(), "EEEE d 'de' MMMM yyyy", { locale: es }),
		[],
	)

	const solicitudesEjecutivo: SolicitudEstudioDto[] = []

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

	const [busqueda, setBusqueda] = useState('')
	const [filtroEstadoComercial, setFiltroEstadoComercial] =
		useState<FiltroEstadoComercialValor>('todos')
	const [kpiAbierto, setKpiAbierto] = useState<KpiPanelDetalleKey | null>(null)
	const [avisoClienteRegistrado, setAvisoClienteRegistrado] = useState<
		string | null
	>(null)
	const [panelSecundario, setPanelSecundario] =
		useState<PanelDetalleSecundario>(null)
	const [diaSeleccionado, setDiaSeleccionado] = useState(hoyIso)
	//const { reminders, addReminder, updateReminder, deleteReminder } = useSharedReminders()
	const [openReminderModal, setOpenReminderModal] = useState(false)
	const [editingReminderId, setEditingReminderId] = useState<string | null>(
		null,
	)
	const defaultClienteRecordatorioId = ''

	const [reminderForm, setReminderForm] = useState<{
		clientId: string
		title: string
		date: string
		time: string
		type: SharedReminderType
		detail: string
		status: SharedReminderStatus
		prioridad: SharedReminderPriority
	}>({
		clientId: defaultClienteRecordatorioId,
		title: '',
		date: hoyIso,
		time: '09:00',
		type: 'llamada',
		detail: '',
		status: 'pendiente',
		prioridad: 'normal',
	})

	const clientesConFiltroEstado = useMemo(
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
	}, [idsClientesEjecutivo, reminders, addReminder, nombreClienteRecordatorio])

	/** Migra recordatorios del perfil que guardaron el nombre del formulario en ejecutivoId. */
	const recordatoriosMigradosRef = useRef(false)
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
	}, [])

	const etiquetaRecordatoriosDia = format(
		new Date(`${diaSeleccionado}T12:00:00`),
		'dd/MM/yyyy',
	)

	return (
		<div className='min-h-screen bg-background'>
			<div>HEADER</div>
			<main className='px-3 py-4 sm:px-4 sm:py-5 lg:p-6'>
				<div className='mx-auto max-w-400 space-y-4 sm:space-y-5'>
					<div>
						<p className='text-sm capitalize text-muted-foreground'>
							{fechaHoy}
						</p>
					</div>

					<div className='grid grid-cols-2 gap-2 lg:grid-cols-4'>
						{tarjetasResumen.map(t => {
							const Icon = t.icon
							return (
								<Card
									key={t.key}
									role='button'
									tabIndex={0}
									className='cursor-pointer border-border bg-card shadow-none transition-colors hover:border-primary/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
									onClick={() => setKpiAbierto(t.key)}
									onKeyDown={e => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault()
											setKpiAbierto(t.key)
										}
									}}
								>
									<CardHeader className='flex flex-row items-start justify-between gap-1 space-y-0 pb-1 pt-3'>
										<CardTitle className='line-clamp-3 min-h-[2.5rem] text-[10px] font-medium leading-snug text-muted-foreground sm:text-[11px]'>
											{t.label}
										</CardTitle>
										<Icon
											className='h-4 w-4 shrink-0 text-muted-foreground'
											aria-hidden
										/>
									</CardHeader>
									<CardContent className='space-y-1.5 pb-3 pt-0'>
										<p className='text-2xl font-semibold tabular-nums text-foreground'>
											{t.value}
										</p>
										{t.bellNuevosSinRevisar != null &&
										t.bellNuevosSinRevisar > 0 ? (
											<div className='flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/[0.08] px-2 py-1.5 text-[10px] text-amber-950 dark:text-amber-50'>
												<Bell
													className='h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400'
													aria-hidden
												/>
												<span>
													<span className='font-semibold tabular-nums'>
														{t.bellNuevosSinRevisar}
													</span>{' '}
													nuevo
													{t.bellNuevosSinRevisar !== 1 ? 's' : ''} por revisar
												</span>
											</div>
										) : null}
									</CardContent>
								</Card>
							)
						})}
					</div>

					<div className='flex flex-col gap-4 sm:gap-5'>
						<Card className='border-border bg-card shadow-none'>
							<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
								<CardTitle className={SECTION}>Búsqueda de clientes</CardTitle>
								<div className='flex shrink-0 flex-wrap gap-1.5'>
									<Button
										size='sm'
										variant='outline'
										className='h-9 text-xs'
										asChild
									>
										<Link href='/ejecutivo-comercial/nuevo-prospecto'>
											<Plus className='mr-1.5 h-3.5 w-3.5' aria-hidden />
											Prospecto
										</Link>
									</Button>
									<Button size='sm' className='h-9 text-xs' asChild>
										<Link href='/ejecutivo-comercial/nuevo-cliente'>
											<Plus className='mr-1.5 h-3.5 w-3.5' aria-hidden />
											Cliente
										</Link>
									</Button>
								</div>
							</CardHeader>
							<CardContent className='space-y-3 p-4'>
								{avisoClienteRegistrado ? (
									<p className='rounded-md border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-2 text-xs text-emerald-950 dark:text-emerald-50'>
										Cliente registrado correctamente. {avisoClienteRegistrado}
									</p>
								) : null}
								<div className='relative'>
									<Search
										className='absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'
										aria-hidden
									/>
									<Input
										placeholder='Nombre, RUT, estado comercial, correo, teléfono o contacto...'
										className='h-9 pl-9 text-sm shadow-none'
										value={busqueda}
										onChange={e => setBusqueda(e.target.value)}
									/>
								</div>

								<FiltrosEstadoComercialPanel
									filtroActivo={filtroEstadoComercial}
									onFiltroChange={setFiltroEstadoComercial}
									conteos={conteosEstadoComercial}
								/>

								{mostrarResultadosFiltrados ? (
									<div className='space-y-2'>
										<p className='text-[11px] text-muted-foreground'>
											{clientesResultadoBusquedaOrdenados.length} cliente
											{clientesResultadoBusquedaOrdenados.length !== 1
												? 's'
												: ''}
											{filtroEstadoComercial !== 'todos' ? (
												<>
													{' '}
													·{' '}
													<span className='text-foreground'>
														{
															ESTADO_CLIENTE_COMERCIAL_LABELS[
																filtroEstadoComercial
															]
														}
													</span>
												</>
											) : null}
											{busqueda.trim() && prospectosFiltrados.length > 0
												? ` · ${prospectosFiltrados.length} prospecto${prospectosFiltrados.length !== 1 ? 's' : ''} en búsqueda`
												: ''}
										</p>
										<div className='max-h-[min(52vh,420px)] space-y-1 overflow-y-auto rounded-md border border-border p-1.5'>
											{clientesResultadoBusquedaOrdenados.length === 0 &&
											(!busqueda.trim() || prospectosFiltrados.length === 0) ? (
												<p className='py-6 text-center text-xs text-muted-foreground'>
													No hay clientes con este estado
													{busqueda.trim()
														? ' que coincidan con la búsqueda'
														: ''}
													.
												</p>
											) : (
												<>
													{clientesResultadoBusquedaOrdenados.map(c => (
														<ClienteFilaBusquedaCompacta key={c.id} c={c} />
													))}
													{busqueda.trim()
														? prospectosFiltrados.map(p => (
																<div
																	key={p.id}
																	className='flex items-center justify-between gap-3 rounded-md border border-violet-500/25 bg-violet-500/[0.04] px-3 py-2 text-xs'
																>
																	<div className='min-w-0 flex-1'>
																		<p className='truncate font-medium leading-snug text-foreground'>
																			{p.nombre}
																		</p>
																		<p className='truncate text-[11px] leading-snug text-muted-foreground'>
																			{TIPO_PROSPECTO_LABELS[p.tipoProspecto]} ·
																			Prospecto
																		</p>
																	</div>
																	<Button
																		size='sm'
																		variant='outline'
																		className='h-7 shrink-0 px-2.5 text-[10px]'
																		asChild
																	>
																		<Link
																			href={`/ejecutivo-comercial/prospecto/${p.id}`}
																		>
																			Ver prospecto
																		</Link>
																	</Button>
																</div>
															))
														: null}
												</>
											)}
										</div>
									</div>
								) : (
									<p className='rounded-md border border-dashed border-border/80 px-3 py-4 text-center text-[11px] text-muted-foreground'>
										Selecciona un estado comercial o escribe en la búsqueda para
										ver clientes.
									</p>
								)}
								<Button
									type='button'
									variant='outline'
									size='sm'
									className='h-8 w-full text-xs'
									onClick={() => setPanelSecundario('clientes')}
								>
									Ver todos los clientes asignados (
									{conteosEstadoComercial.todos})
								</Button>
							</CardContent>
						</Card>

						<Card className='border-border bg-card shadow-none'>
							<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-start sm:justify-between'>
								<div className='min-w-0 flex-1 space-y-2'>
									<CardTitle className={SECTION}>Recordatorios</CardTitle>
									<p className='text-xs tabular-nums text-muted-foreground'>
										{etiquetaRecordatoriosDia}
										{diaSeleccionado === hoyIso ? ' · Hoy' : ''}
									</p>
									<Input
										type='date'
										value={diaSeleccionado}
										onChange={e => setDiaSeleccionado(e.target.value)}
										className='h-8 max-w-[11rem] text-xs'
										aria-label='Seleccionar fecha de recordatorios'
									/>
								</div>
								<Button
									type='button'
									size='sm'
									variant='outline'
									className='h-8 shrink-0 px-2.5 text-xs'
									onClick={abrirCrearRecordatorio}
								>
									+ Nuevo
								</Button>
							</CardHeader>
							<CardContent className='space-y-2 p-4'>
								{recordatoriosFechaSeleccionada.length === 0 ? (
									<p className='rounded-md border border-dashed border-border/80 py-4 text-center text-xs text-muted-foreground'>
										No hay recordatorios para esta fecha.
									</p>
								) : (
									<div className='space-y-2'>
										{recordatoriosFechaSeleccionada.map(item => (
											<RecordatorioDiaCard
												key={item.id}
												item={item}
												clientName={nombreClienteRecordatorio(item.clientId)}
												onComplete={() => handleCompleteReminder(item.id)}
												onEdit={() => handleEditReminder(item.id)}
												onDelete={() => handleDeleteReminder(item.id)}
											/>
										))}
									</div>
								)}
							</CardContent>
						</Card>

						<div className='grid gap-4 md:grid-cols-2'>
							<Card className='border-border bg-card shadow-none'>
								<CardHeader className='flex flex-row items-center justify-between border-b border-border pb-2 pt-3'>
									<CardTitle className={SECTION}>Calendario</CardTitle>
									<CalendarDays
										className='h-4 w-4 text-muted-foreground'
										aria-hidden
									/>
								</CardHeader>
								<CardContent className='space-y-2 p-3'>
									<div className='flex items-center justify-between gap-2'>
										<p className='text-xs font-medium capitalize text-foreground'>
											{format(new Date(`${hoyIso}T12:00:00`), 'MMMM yyyy', {
												locale: es,
											})}
										</p>
										<p className='text-[10px] text-muted-foreground'>
											Hoy: {formatFechaCorta(hoyIso)}
										</p>
									</div>
									<Calendario
										dias={diasCalendario}
										diaSeleccionado={diaSeleccionado}
										onSeleccionarDia={setDiaSeleccionado}
									/>
									<div className='rounded-md border border-border/80 px-3 py-2'>
										<p className='mb-1 text-[11px] font-medium text-foreground'>
											{etiquetaDiaAgenda(diaSeleccionado, hoyIso)}
										</p>
										{actividadesDiaSeleccionado.length === 0 ? (
											<p className='text-[11px] text-muted-foreground'>
												Sin actividades para este día.
											</p>
										) : (
											<div className='space-y-1.5'>
												{actividadesDiaSeleccionado.slice(0, 3).map(a => (
													<Link
														key={a.id}
														href={a.href}
														className='block text-[11px] hover:underline'
													>
														<span className='font-medium tabular-nums text-foreground'>
															{a.hora}
														</span>{' '}
														<span className='text-muted-foreground'>
															{a.titulo} · {a.cliente}
														</span>
													</Link>
												))}
											</div>
										)}
									</div>
									<Button
										type='button'
										variant='outline'
										size='sm'
										className='h-8 w-full text-xs'
										onClick={() => setPanelSecundario('calendario')}
									>
										Ver calendario
									</Button>
								</CardContent>
							</Card>

							{/*<NotasPanelSection panelId='ejecutivo-comercial' />*/}
						</div>

						<Card className='border-border bg-card shadow-none'>
							<CardHeader className='flex flex-row items-center justify-between border-b border-border pb-2 pt-3'>
								<CardTitle className={SECTION}>Avisos de gerencia</CardTitle>
								<Bell className='h-4 w-4 text-muted-foreground' aria-hidden />
							</CardHeader>
							<CardContent className='space-y-2 p-3 sm:p-4'>
								{AVISOS_GERENCIA.length === 0 ? (
									<p className='py-3 text-center text-xs text-muted-foreground'>
										Sin avisos relevantes por ahora.
									</p>
								) : (
									<div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
										{AVISOS_GERENCIA.map(aviso => (
											<div
												key={aviso.id}
												className='rounded-md border border-border/80 px-3 py-2 text-xs'
											>
												<div className='flex items-start justify-between gap-2'>
													<p className='font-medium text-foreground'>
														{aviso.titulo}
													</p>
													<Badge
														variant='outline'
														className='h-5 shrink-0 text-[9px]'
													>
														{aviso.prioridad}
													</Badge>
												</div>
												<p className='mt-1 leading-snug text-muted-foreground'>
													{aviso.mensaje}
												</p>
												<p className='mt-1 text-[10px] tabular-nums text-muted-foreground'>
													{aviso.fecha}
												</p>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</main>

			{/*<PanelKpiDetalleSheet
				abierto={kpiAbierto != null}
				onOpenChange={open => {
					if (!open) setKpiAbierto(null)
				}}
				kpiKey={kpiAbierto}
				datos={detalleKpi}
			/>*/}

			<Sheet
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
									{todosClientesEjecutivoOrdenados.map(c => (
										<FilaProspecto key={c.id} prospecto={c} />
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
			</Sheet>

			<Dialog open={openReminderModal} onOpenChange={setOpenReminderModal}>
				<DialogContent className='max-w-md'>
					<DialogHeader>
						<DialogTitle>
							{editingReminderId ? 'Editar recordatorio' : 'Crear recordatorio'}
						</DialogTitle>
						<DialogDescription>
							Asocia recordatorios comerciales al calendario del día.
						</DialogDescription>
					</DialogHeader>
					<div className='space-y-3'>
						<Select
							value={reminderForm.clientId}
							onValueChange={value =>
								setReminderForm(p => ({ ...p, clientId: value }))
							}
						>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Cliente asociado' />
							</SelectTrigger>
							<SelectContent>
								{clientesEjecutivo.map(c => (
									<SelectItem key={c.id} value={c.id}>
										{c.nombre}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Input
							placeholder='Título'
							value={reminderForm.title}
							onChange={e =>
								setReminderForm(p => ({ ...p, title: e.target.value }))
							}
						/>
						<div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
							<Input
								type='date'
								value={reminderForm.date}
								onChange={e =>
									setReminderForm(p => ({ ...p, date: e.target.value }))
								}
							/>
							<Input
								type='time'
								value={reminderForm.time}
								onChange={e =>
									setReminderForm(p => ({ ...p, time: e.target.value }))
								}
							/>
						</div>
						<div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
							<Select
								value={reminderForm.prioridad}
								onValueChange={(value: SharedReminderPriority) =>
									setReminderForm(p => ({
										...p,
										prioridad: value,
									}))
								}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Prioridad' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='baja'>Baja</SelectItem>
									<SelectItem value='normal'>Normal</SelectItem>
									<SelectItem value='alta'>Alta</SelectItem>
								</SelectContent>
							</Select>
							<Select
								value={reminderForm.type}
								onValueChange={(value: SharedReminderType) =>
									setReminderForm(p => ({ ...p, type: value }))
								}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Tipo' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='llamada'>Llamada</SelectItem>
									<SelectItem value='correo'>Correo</SelectItem>
									<SelectItem value='whatsapp'>Mensaje</SelectItem>
									<SelectItem value='visita'>Visita</SelectItem>
									<SelectItem value='otro'>General</SelectItem>
								</SelectContent>
							</Select>
							<Select
								value={reminderForm.status}
								onValueChange={(value: SharedReminderStatus) =>
									setReminderForm(p => ({
										...p,
										status: value,
									}))
								}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Estado' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='pendiente'>Pendiente</SelectItem>
									<SelectItem value='realizado'>Completado</SelectItem>
									<SelectItem value='atrasado'>Atrasado</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Textarea
							placeholder='Detalle'
							value={reminderForm.detail}
							onChange={e =>
								setReminderForm(p => ({ ...p, detail: e.target.value }))
							}
						/>
					</div>
					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => setOpenReminderModal(false)}
						>
							Cancelar
						</Button>
						<Button type='button' size='sm' onClick={handleAddReminder}>
							{editingReminderId ? 'Guardar cambios' : 'Guardar recordatorio'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

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
}

function etiquetaDiaAgenda(fechaIso: string, hoyIso: string) {
	const fecha = new Date(`${fechaIso}T12:00:00`)
	const hoy = new Date(`${hoyIso}T12:00:00`)
	const diff = Math.round((fecha.getTime() - hoy.getTime()) / 86_400_000)

	if (diff === 0) return 'Hoy'
	if (diff === 1) return 'Mañana'
	if (diff === -1) return 'Ayer'

	return formatFechaCorta(fechaIso)
}
