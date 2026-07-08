import { format } from 'date-fns'
import { useEffect, useSyncExternalStore } from 'react'

export type SharedReminderType =
	| 'llamada'
	| 'correo'
	| 'visita'
	| 'whatsapp'
	| 'reunion'
	| 'otro'
	| 'cobranza_anticipada'
export type SharedReminderStatus = 'atrasado' | 'pendiente' | 'realizado'
export type SharedReminderPriority = 'normal' | 'alta'
export type SharedReminderCategoria =
	| 'general'
	| 'seguimiento_comercial'
	| 'seguimiento_futuro_cerrado_perdido'
export type PanelEntidadRecordatorio = 'prospecto' | 'cliente'

export function esRecordatorioAsociadoACliente(
	reminder: SharedReminder,
): boolean {
	//if (reminder.asociadoACliente === false) return false;
	return Boolean(reminder.clientId?.trim())
}

export const reminderStatusStyles: Record<SharedReminderStatus, string> = {
	atrasado: 'bg-destructive/15 text-destructive border-destructive/30',
	pendiente:
		'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700',
	realizado:
		'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
}

export const reminderStatusLabel: Record<SharedReminderStatus, string> = {
	atrasado: 'Vencido',
	pendiente: 'Pendiente',
	realizado: 'Completado',
}

export type SharedReminder = {
	id: string
	clientId: string
	policyId?: string
	title: string
	date: string
	time: string
	type: SharedReminderType
	status: SharedReminderStatus
	detail: string
	/** Identificador del ejecutivo del panel (usuario actual). */
	ejecutivoId?: string
	/** Nombre visible del ejecutivo al crear el recordatorio. */
	ejecutivoNombre?: string
	/** Nombre del cliente al momento de crear (evita búsquedas repetidas). */
	clienteNombre?: string
	prioridad?: SharedReminderPriority
	/** ISO 8601 — fecha de creación del recordatorio. */
	fechaCreacion?: string
	/** Origen del recordatorio; seguimiento comercial sincroniza desde el perfil del cliente. */
	categoria?: SharedReminderCategoria
	/** ID de la llamada programada en seguimiento comercial (fuente única). */
	seguimientoLlamadaId?: string
	/** Último resultado de gestión comercial (solo categoría seguimiento). */
	resultadoSeguimiento?: string
	/** Prospecto o cliente formal (recordatorios generales y tras conversión). */
	panelEntidad?: PanelEntidadRecordatorio
}

export const REMINDER_TYPE_LABELS: Record<SharedReminderType, string> = {
	llamada: 'Llamada',
	correo: 'Correo',
	whatsapp: 'Mensaje',
	visita: 'Visita',
	reunion: 'Visita',
	otro: 'Otro',
	cobranza_anticipada: 'Cobranza',
}

export function etiquetaTipoRecordatorio(type: SharedReminderType): string {
	return REMINDER_TYPE_LABELS[type] ?? type
}

export const prioridadReminderLabel: Record<SharedReminderPriority, string> = {
	normal: 'Normal',
	alta: 'Alta',
}

export const prioridadReminderStyles: Record<SharedReminderPriority, string> = {
	normal: 'border-blue-500/35 bg-blue-500/10 text-blue-950 dark:text-blue-100',
	alta: 'border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-100',
}

/** Normaliza un recordatorio persistido (compatibilidad con versiones anteriores). */
export function normalizarRecordatorio(
	reminder: SharedReminder,
): SharedReminder {
	return {
		...reminder,
		ejecutivoNombre: reminder.ejecutivoNombre ?? reminder.ejecutivoId,
		fechaCreacion: reminder.fechaCreacion ?? reminder.date,
	}
}

/**
 * Recordatorio visible en el panel del ejecutivo:
 * - el cliente debe estar en su cartera, y
 * - el ejecutivoId del recordatorio coincide con el usuario del panel (si está definido).
 */
export function etiquetaPanelRecordatorio(reminder: SharedReminder): string {
	if (reminder.categoria === 'seguimiento_futuro_cerrado_perdido') {
		return 'Seguimiento futuro (cerrado perdido)'
	}
	if (reminder.categoria === 'seguimiento_comercial')
		return 'Seguimiento comercial'
	if (reminder.panelEntidad === 'prospecto') return 'Prospecto'
	return 'Cliente'
}

export function recordatorioPerteneceEjecutivo(
	reminder: SharedReminder,
	ejecutivoId: string,
	idsEntidadesEjecutivo: ReadonlySet<string>,
): boolean {
	if (!idsEntidadesEjecutivo.has(reminder.clientId)) return false
	const asignado = reminder.ejecutivoId?.trim()
	if (!asignado) return true
	return asignado === ejecutivoId
}

/** Recordatorios pendientes del ejecutivo para una fecha (p. ej. hoy). */
export function migrarRecordatoriosEntidadId(
	origenId: string,
	destinoId: string,
	destinoNombre: string,
	panelEntidad: PanelEntidadRecordatorio = 'cliente',
) {
	hydrate()
	store = store.map(item => {
		if (item.clientId !== origenId) return item
		return normalizarRecordatorio({
			...item,
			clientId: destinoId,
			clienteNombre: destinoNombre,
			panelEntidad,
		})
	})
	persist()
	emit()
}

export function recordatoriosEjecutivoEnFecha(
	reminders: readonly SharedReminder[],
	ejecutivoId: string,
	fechaIso: string,
	idsEntidadesEjecutivo: ReadonlySet<string>,
): SharedReminder[] {
	return reminders.filter(
		r =>
			recordatorioPerteneceEjecutivo(r, ejecutivoId, idsEntidadesEjecutivo) &&
			r.date === fechaIso &&
			(r.status === 'pendiente' || r.status === 'atrasado'),
	)
}

export function recordatoriosCliente(
	reminders: readonly SharedReminder[],
	clienteId: string,
): SharedReminder[] {
	return reminders.filter(r => r.clientId === clienteId)
}

const STORAGE_KEY = 'crm_shared_reminders_v1'

const listeners = new Set<() => void>()

const getTodayKey = () => format(new Date(), 'yyyy-MM-dd')

const buildDefaultReminders = (): SharedReminder[] => [
	{
		id: 'rem-1',
		clientId: 'cl1',
		policyId: 'pol1',
		title: 'Llamar por deuda vencida',
		date: getTodayKey(),
		time: '09:30',
		type: 'llamada',
		status: 'atrasado',
		detail: 'Insistir en plan de regularizacion.',
	},
	{
		id: 'rem-2',
		clientId: 'cl4',
		policyId: 'pol3',
		title: 'Enviar correo de seguimiento',
		date: getTodayKey(),
		time: '11:00',
		type: 'correo',
		status: 'pendiente',
		detail: 'Adjuntar opciones de pago.',
	},
	{
		id: 'rem-3',
		clientId: 'cl7',
		policyId: 'pol4',
		title: 'Confirmar cierre de cobranza',
		date: getTodayKey(),
		time: '16:00',
		type: 'llamada',
		status: 'realizado',
		detail: 'Cierre registrado en CRM.',
	},
]

let store: SharedReminder[] = buildDefaultReminders()
let hydrated = false

const emit = () => {
	listeners.forEach(listener => listener())
}

const persist = () => {
	if (typeof window === 'undefined') return
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

const hydrate = () => {
	if (typeof window === 'undefined' || hydrated) return
	hydrated = true
	const raw = window.localStorage.getItem(STORAGE_KEY)
	if (!raw) {
		persist()
		return
	}
	try {
		const parsed = JSON.parse(raw) as SharedReminder[]
		if (Array.isArray(parsed)) {
			const seen = new Set<string>()
			store = parsed.map(normalizarRecordatorio).filter(r => {
				if (seen.has(r.id)) return false
				seen.add(r.id)
				return true
			})
		}
	} catch {
		persist()
	}
}

const subscribe = (listener: () => void) => {
	listeners.add(listener)
	return () => listeners.delete(listener)
}

const getSnapshot = () => store

const getServerSnapshot = () => store

export const addSharedReminder = (reminder: SharedReminder) => {
	hydrate()
	const normalized = normalizarRecordatorio(reminder)
	const existing = store.findIndex(item => item.id === normalized.id)
	if (existing >= 0) {
		store = store.map((item, index) => (index === existing ? normalized : item))
	} else {
		store = [...store, normalized]
	}
	persist()
	emit()
}

export const updateSharedReminder = (
	reminderId: string,
	updater:
		| Partial<SharedReminder>
		| ((previous: SharedReminder) => SharedReminder),
) => {
	hydrate()
	store = store.map(item => {
		if (item.id !== reminderId) return item
		if (typeof updater === 'function')
			return normalizarRecordatorio(updater(item))
		return normalizarRecordatorio({ ...item, ...updater })
	})
	persist()
	emit()
}

export const deleteSharedReminder = (reminderId: string) => {
	hydrate()
	store = store.filter(item => item.id !== reminderId)
	persist()
	emit()
}

export const useSharedReminders = () => {
	useEffect(() => {
		hydrate()
		emit()
	}, [])

	const reminders = useSyncExternalStore(
		subscribe,
		getSnapshot,
		getServerSnapshot,
	)
	return {
		reminders,
		addReminder: addSharedReminder,
		updateReminder: updateSharedReminder,
		deleteReminder: deleteSharedReminder,
	}
}
