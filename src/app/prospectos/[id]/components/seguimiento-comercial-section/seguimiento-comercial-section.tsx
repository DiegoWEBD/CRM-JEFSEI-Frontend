'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useFormik } from 'formik'
import { CalendarPlus, History, Loader2, Phone } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import * as Yup from 'yup'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Checkbox } from '@/components/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { Textarea } from '@/components/textarea'

import type { RegistrarGestionComercialRequest } from '@/aplicacion/gestion-comercial/use-cases/registrar-gestion-comercial/dto/registrar-gestion-comercial-request'
import { useAuthContext } from '@/contexts/auth-context'
import { useObtenerGestionesComerciales } from '@/hooks/gestion-comercial/use-obtener-gestiones-comerciales'
import { useObtenerUltimaGestionComercial } from '@/hooks/gestion-comercial/use-obtener-ultima-gestion-comercial'
import { useRegistrarGestionComercial } from '@/hooks/gestion-comercial/use-registrar-gestion-comercial'
import { useProximoContacto } from '@/hooks/recordatorios/use-proximo-contacto'
import { useRegistrarRecordatorio } from '@/hooks/recordatorios/use-registrar-recordatorio'
import { cn } from '@/lib/utils'

const SECTION_TITLE =
	'text-sm font-semibold leading-tight tracking-tight text-foreground'

const TIPOS_GESTION = ['llamada', 'correo', 'visita', 'mensaje'] as const
const TIPO_GESTION_LABELS: Record<string, string> = {
	llamada: 'Llamada',
	correo: 'Correo electrónico',
	visita: 'Visita',
	mensaje: 'Mensaje',
}

const TIPOS_RECORDATORIO = [
	'llamada',
	'correo',
	'whatsapp',
	'visita',
	'reunion',
	'otro',
] as const
const TIPO_RECORDATORIO_LABELS: Record<string, string> = {
	llamada: 'Llamada',
	correo: 'Correo electrónico',
	whatsapp: 'Mensaje',
	visita: 'Visita',
	reunion: 'Reunión',
	otro: 'General',
}

const ESTADOS_CONTACTO = [
	'no_contesta',
	'pide_contacto_despues',
	'pendiente de respuesta',
	'no interesado por ahora',
	'sin respuesta tras seguimiento',
] as const
const ESTADO_CONTACTO_LABELS: Record<string, string> = {
	no_contesta: 'No contesta',
	pide_contacto_despues: 'Pide contacto después',
	'pendiente de respuesta': 'Pendiente de respuesta',
	'no interesado por ahora': 'No interesado por ahora',
	'sin respuesta tras seguimiento': 'Sin respuesta tras seguimiento',
}

const ESTADO_CONTACTO_PROXIMA_ACCION: Record<string, string> = {
	no_contesta: 'Se agendará una llamada cada 3 días por 5 semanas.',
	pide_contacto_despues: 'Se agendará una llamada cada 4 días por 5 semanas.',
	'pendiente de respuesta': 'Se agendará una llamada cada 3 días por 5 semanas.',
	'no interesado por ahora':
		'Se agendará una llamada dentro de 2 meses.',
	'sin respuesta tras seguimiento': 'Se agendará una llamada dentro de 2 meses.',
}

const ESTADO_BADGE: Record<string, string> = {
	sin_iniciado:
		'border-slate-500/35 bg-slate-500/10 text-slate-900 dark:text-slate-100',
	en_seguimiento:
		'border-blue-500/35 bg-blue-500/10 text-blue-950 dark:text-blue-100',
}

const ESTADO_SEGUIMIENTO_LABELS: Record<string, string> = {
	sin_iniciado: 'Sin iniciar',
	en_seguimiento: 'En seguimiento',
}

function horaAhora() {
	return format(new Date(), 'HH:mm')
}

function hoyIso() {
	return format(new Date(), 'yyyy-MM-dd')
}

function fechaGestionText(fechaGestion: string): string {
	const d = new Date(fechaGestion)
	return format(d, "d MMM yyyy '·' HH:mm", { locale: es })
}

function formatearUltimaGestion(
	gestion: { fecha_gestion: string; titulo: string } | null,
): string {
	if (!gestion) return '—'
	const d = new Date(gestion.fecha_gestion)
	const fecha = format(d, 'd MMM yyyy', { locale: es })
	const hora = format(d, 'HH:mm')
	return `${fecha} · ${hora}`
}

function autoGenerarTituloGestion(values: {
	tipo: string
	soloHistorial: boolean
	estadoContacto: string
}): string {
	const label = TIPO_GESTION_LABELS[values.tipo] ?? values.tipo
	if (values.soloHistorial) return label
	if (values.tipo === 'llamada' && values.estadoContacto) {
		const estadoLabel =
			ESTADO_CONTACTO_LABELS[values.estadoContacto] ?? values.estadoContacto
		return `${label} — ${estadoLabel}`
	}
	return label
}

type SeguimientoComercialSectionProps = {
	idProspecto: number
	nombreCliente: string
}

export default function SeguimientoComercialSection({
	idProspecto,
	nombreCliente,
}: SeguimientoComercialSectionProps) {
	const { usuario } = useAuthContext()

	const [modal, setModal] = useState<'registrar' | 'agendar' | null>(null)

	const { data: gestiones, isLoading: loadingGestiones } =
		useObtenerGestionesComerciales(idProspecto)
	const { data: ultimaGestion } = useObtenerUltimaGestionComercial(idProspecto)
	const { data: proximoContacto, isLoading: loadingProximo } =
		useProximoContacto(usuario?.rut ?? '', idProspecto)

	const mutationGestion = useRegistrarGestionComercial()
	const mutationRecordatorio = useRegistrarRecordatorio()

	const estadoSeguimiento = useMemo(() => {
		if (!gestiones || gestiones.length === 0) return 'sin_iniciado'
		return 'en_seguimiento'
	}, [gestiones])

	const historial = useMemo(() => {
		if (!gestiones) return []
		return gestiones
	}, [gestiones])

	const ultimaGestionTexto = useMemo(
		() => formatearUltimaGestion(ultimaGestion ?? null),
		[ultimaGestion],
	)

	const formikGestion = useFormik({
		initialValues: {
			fecha: hoyIso(),
			hora: horaAhora(),
			tipo: 'llamada' as string,
			soloHistorial: true,
			estadoContacto: 'no_contesta' as string,
			observacion: '',
		},
		validationSchema: Yup.object({
			fecha: Yup.string().required('La fecha es obligatoria'),
			hora: Yup.string().required('La hora es obligatoria'),
			tipo: Yup.string()
				.oneOf(TIPOS_GESTION as unknown as string[], 'Selecciona un tipo')
				.required(),
		}),
		onSubmit: async (values, { resetForm }) => {
			const fechaGestion = new Date(
				`${values.fecha}T${values.hora}:00`,
			).toISOString()
			const request: RegistrarGestionComercialRequest = {
				tipo: values.tipo as RegistrarGestionComercialRequest['tipo'],
				id_prospecto: idProspecto,
				titulo: autoGenerarTituloGestion(values),
				estado_contacto: values.soloHistorial ? null : values.estadoContacto,
				observacion: values.observacion.trim() || null,
				fecha_gestion: fechaGestion,
			}
			try {
				await mutationGestion.mutateAsync(request)
				toast.success('Gestión registrada')
				resetForm()
				setModal(null)
			} catch {
				toast.error('Error al registrar la gestión')
			}
		},
	})

	const formikAgendar = useFormik({
		initialValues: {
			tipo: 'llamada' as string,
			fecha: hoyIso(),
			hora: '10:00',
			titulo: `Contactar con ${nombreCliente}`,
			motivo: '',
		},
		validationSchema: Yup.object({
			titulo: Yup.string().required('El título es obligatorio'),
			fecha: Yup.string().required('La fecha es obligatoria'),
			hora: Yup.string().required('La hora es obligatoria'),
			tipo: Yup.string()
				.oneOf(TIPOS_RECORDATORIO as unknown as string[], 'Selecciona un tipo')
				.required(),
		}),
		onSubmit: async (values, { resetForm }) => {
			const fechaRecordatorio = new Date(
				`${values.fecha}T${values.hora}:00`,
			).toISOString()
			try {
				await mutationRecordatorio.mutateAsync({
					titulo: values.titulo,
					detalle: values.motivo.trim() || null,
					prioridad: 'normal',
					tipo_gestion: values.tipo,
					fecha_recordatorio: fechaRecordatorio,
					id_prospecto: idProspecto,
				})
				toast.success('Recordatorio agendado')
				resetForm()
				setModal(null)
			} catch {
				toast.error('Error al agendar el recordatorio')
			}
		},
	})

	function openModal(tipo: 'registrar' | 'agendar') {
		if (tipo === 'registrar') {
			formikGestion.resetForm()
		} else {
			formikAgendar.resetForm()
		}
		setModal(tipo)
	}

	return (
		<>
			<Card className='border-border bg-card shadow-none'>
				<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
					<CardTitle className={`${SECTION_TITLE} flex items-center gap-2`}>
						<Phone className='h-4 w-4 text-muted-foreground' aria-hidden />
						Seguimiento comercial
					</CardTitle>
					<div className='flex flex-wrap gap-1.5'>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-8 text-xs'
							onClick={() => openModal('registrar')}
						>
							Registrar gestión comercial
						</Button>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-8 text-xs'
							onClick={() => openModal('agendar')}
						>
							<CalendarPlus className='mr-1 h-3.5 w-3.5' aria-hidden />
							Agendar próximo contacto
						</Button>
					</div>
				</CardHeader>

				<CardContent className='p-4'>
					{loadingGestiones ? (
						<div className='flex items-center justify-center py-6'>
							<Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
						</div>
					) : (
						<div className='space-y-4'>
							<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
								<ResumenItem label='Estado del seguimiento'>
									<Badge
										variant='outline'
										className={cn(
											'text-[10px] font-medium',
											ESTADO_BADGE[estadoSeguimiento],
										)}
									>
										{ESTADO_SEGUIMIENTO_LABELS[estadoSeguimiento]}
									</Badge>
								</ResumenItem>
								<ResumenItem label='Última gestión realizada'>
									{ultimaGestionTexto}
								</ResumenItem>
								<ResumenItem label='Estado de contacto'>
									{ultimaGestion?.estado_contacto
										? (ESTADO_CONTACTO_LABELS[ultimaGestion.estado_contacto] ??
											ultimaGestion.estado_contacto)
										: '—'}
								</ResumenItem>
								<ResumenItem label='Próxima fecha de contacto'>
									{loadingProximo ? (
										<span className='text-xs text-muted-foreground'>
											Cargando…
										</span>
									) : proximoContacto ? (
										fechaGestionText(proximoContacto.fecha_recordatorio)
									) : (
										'—'
									)}
								</ResumenItem>
							</div>

							{historial.length > 0 ? (
								<div className='space-y-2'>
									<p className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
										<History className='h-3.5 w-3.5' aria-hidden />
										Historial de seguimiento
									</p>
									<ul className='max-h-48 space-y-1 overflow-y-auto rounded-md border border-border bg-muted/20 px-3 py-2'>
										{historial.map(h => (
											<li
												key={h.id}
												className='text-xs leading-relaxed text-foreground'
											>
												<span className='tabular-nums text-muted-foreground'>
													{format(
														new Date(h.fecha_gestion),
														'd MMM yyyy HH:mm',
														{ locale: es },
													)}
												</span>
												{' — '}
												{h.titulo}
												{h.estado_contacto ? (
													<>
														{' — '}
														{ESTADO_CONTACTO_LABELS[h.estado_contacto] ??
															h.estado_contacto}
													</>
												) : null}
												{h.observacion ? <>. {h.observacion}</> : null}
											</li>
										))}
									</ul>
								</div>
							) : (
								<p className='text-xs text-muted-foreground'>
									Aún no hay gestiones registradas. Usa «Registrar gestión
									comercial» para iniciar el seguimiento.
								</p>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			<Dialog
				open={modal === 'registrar'}
				onOpenChange={o => !o && setModal(null)}
			>
				<DialogContent className='max-w-md'>
					<DialogHeader>
						<DialogTitle>Registrar gestión comercial</DialogTitle>
						<DialogDescription>
							Registra el contacto con opciones cerradas. Usa la observación
							breve solo para detalles adicionales.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={formikGestion.handleSubmit}>
						<div className='space-y-3'>
							<div className='grid grid-cols-2 gap-2'>
								<div className='space-y-1.5'>
									<Label className='text-xs'>Fecha</Label>
									<Input
										type='date'
										className='h-9 text-sm'
										name='fecha'
										value={formikGestion.values.fecha}
										onChange={formikGestion.handleChange}
										onBlur={formikGestion.handleBlur}
									/>
									{formikGestion.touched.fecha &&
										formikGestion.errors.fecha && (
											<p className='text-xs font-medium text-destructive'>
												{formikGestion.errors.fecha}
											</p>
										)}
								</div>
								<div className='space-y-1.5'>
									<Label className='text-xs'>Hora</Label>
									<Input
										type='time'
										className='h-9 text-sm'
										name='hora'
										value={formikGestion.values.hora}
										onChange={formikGestion.handleChange}
										onBlur={formikGestion.handleBlur}
									/>
									{formikGestion.touched.hora && formikGestion.errors.hora && (
										<p className='text-xs font-medium text-destructive'>
											{formikGestion.errors.hora}
										</p>
									)}
								</div>
							</div>

							<div className='space-y-1.5'>
								<Label className='text-xs'>Tipo de gestión</Label>
								<Select
									value={formikGestion.values.tipo}
									onValueChange={v => formikGestion.setFieldValue('tipo', v)}
								>
									<SelectTrigger className='h-9 text-xs'>
										<SelectValue placeholder='Seleccione tipo' />
									</SelectTrigger>
									<SelectContent>
										{TIPOS_GESTION.map(k => (
											<SelectItem key={k} value={k} className='text-xs'>
												{TIPO_GESTION_LABELS[k]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{formikGestion.touched.tipo && formikGestion.errors.tipo && (
									<p className='text-xs font-medium text-destructive'>
										{formikGestion.errors.tipo}
									</p>
								)}
							</div>

							{formikGestion.values.tipo === 'llamada' && (
								<div className='flex items-start gap-2 rounded-md border border-border/80 bg-muted/20 px-3 py-2'>
									<Checkbox
										id='solo-historial-gestion'
										checked={formikGestion.values.soloHistorial}
										onCheckedChange={c =>
											formikGestion.setFieldValue('soloHistorial', c === true)
										}
									/>
									<label
										htmlFor='solo-historial-gestion'
										className='cursor-pointer text-xs leading-snug text-foreground'
									>
										Cliente contactado sin seguimiento (solo historial)
									</label>
								</div>
							)}

							{formikGestion.values.tipo === 'llamada' &&
								!formikGestion.values.soloHistorial && (
									<>
										<div className='space-y-1.5'>
											<Label className='text-xs'>Estado de contacto</Label>
											<Select
												value={formikGestion.values.estadoContacto}
												onValueChange={v =>
													formikGestion.setFieldValue('estadoContacto', v)
												}
											>
												<SelectTrigger className='h-9 text-xs'>
													<SelectValue placeholder='Seleccione estado' />
												</SelectTrigger>
												<SelectContent>
													{ESTADOS_CONTACTO.map(k => (
														<SelectItem key={k} value={k} className='text-xs'>
															{ESTADO_CONTACTO_LABELS[k]}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className='rounded-md border border-dashed border-border bg-muted/30 px-3 py-2'>
											<p className='text-[11px] font-medium text-foreground'>
												Próxima acción (automática)
											</p>
											<p className='mt-1 text-[11px] text-muted-foreground'>
												{ESTADO_CONTACTO_PROXIMA_ACCION[
													formikGestion.values.estadoContacto
												] ?? ''}
											</p>
										</div>
									</>
								)}

							<div className='space-y-1.5'>
								<Label className='text-xs'>Observación breve</Label>
								<Textarea
									className='min-h-[72px] text-sm'
									name='observacion'
									value={formikGestion.values.observacion}
									onChange={formikGestion.handleChange}
									placeholder='Notas de la conversación…'
								/>
							</div>
						</div>

						<DialogFooter className='mt-4 gap-2'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => setModal(null)}
							>
								Cancelar
							</Button>
							<Button
								type='submit'
								size='sm'
								disabled={formikGestion.isSubmitting}
							>
								{formikGestion.isSubmitting ? (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								) : null}
								Guardar gestión
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={modal === 'agendar'}
				onOpenChange={o => !o && setModal(null)}
			>
				<DialogContent className='max-w-sm'>
					<DialogHeader>
						<DialogTitle>Agendar próximo contacto</DialogTitle>
						<DialogDescription>
							Programa el siguiente contacto con el cliente.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={formikAgendar.handleSubmit}>
						<div className='space-y-3'>
							<div className='space-y-1.5'>
								<Label className='text-xs'>Tipo de contacto</Label>
								<Select
									value={formikAgendar.values.tipo}
									onValueChange={v => formikAgendar.setFieldValue('tipo', v)}
								>
									<SelectTrigger className='h-9 text-xs'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{TIPOS_RECORDATORIO.map(k => (
											<SelectItem key={k} value={k} className='text-xs'>
												{TIPO_RECORDATORIO_LABELS[k]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{formikAgendar.touched.tipo && formikAgendar.errors.tipo && (
									<p className='text-xs font-medium text-destructive'>
										{formikAgendar.errors.tipo}
									</p>
								)}
							</div>

							<div className='grid grid-cols-2 gap-2'>
								<div className='space-y-1.5'>
									<Label className='text-xs'>Fecha</Label>
									<Input
										type='date'
										className='h-9 text-sm'
										name='fecha'
										value={formikAgendar.values.fecha}
										onChange={formikAgendar.handleChange}
										onBlur={formikAgendar.handleBlur}
									/>
									{formikAgendar.touched.fecha &&
										formikAgendar.errors.fecha && (
											<p className='text-xs font-medium text-destructive'>
												{formikAgendar.errors.fecha}
											</p>
										)}
								</div>
								<div className='space-y-1.5'>
									<Label className='text-xs'>Hora</Label>
									<Input
										type='time'
										className='h-9 text-sm'
										name='hora'
										value={formikAgendar.values.hora}
										onChange={formikAgendar.handleChange}
										onBlur={formikAgendar.handleBlur}
									/>
									{formikAgendar.touched.hora && formikAgendar.errors.hora && (
										<p className='text-xs font-medium text-destructive'>
											{formikAgendar.errors.hora}
										</p>
									)}
								</div>
							</div>

							<div className='space-y-1.5'>
								<Label className='text-xs'>Título</Label>
								<Input
									className='h-9 text-sm'
									name='titulo'
									value={formikAgendar.values.titulo}
									onChange={formikAgendar.handleChange}
									onBlur={formikAgendar.handleBlur}
									placeholder='Título del recordatorio'
								/>
								{formikAgendar.touched.titulo &&
									formikAgendar.errors.titulo && (
										<p className='text-xs font-medium text-destructive'>
											{formikAgendar.errors.titulo}
										</p>
									)}
							</div>

							<div className='space-y-1.5'>
								<Label className='text-xs'>Motivo (opcional)</Label>
								<Textarea
									className='min-h-[72px] text-sm'
									name='motivo'
									value={formikAgendar.values.motivo}
									onChange={formikAgendar.handleChange}
									placeholder='Ej. enviar cotización'
								/>
							</div>
						</div>

						<DialogFooter className='mt-4 gap-2'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => setModal(null)}
							>
								Cancelar
							</Button>
							<Button
								type='submit'
								size='sm'
								disabled={formikAgendar.isSubmitting}
							>
								{formikAgendar.isSubmitting ? (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								) : null}
								Agendar
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	)
}

function ResumenItem({
	label,
	children,
}: {
	label: string
	children: ReactNode
}) {
	return (
		<div className='space-y-1'>
			<p className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
				{label}
			</p>
			<div className='text-sm text-foreground'>{children}</div>
		</div>
	)
}
