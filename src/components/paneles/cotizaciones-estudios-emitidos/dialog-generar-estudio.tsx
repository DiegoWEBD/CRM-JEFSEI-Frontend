'use client'

import { PanelEstudioFila } from '@/aplicacion/cotizaciones-estudios/dto/panel-estudio-fila'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Checkbox } from '@/components/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import Campo from '@/components/forms/campo/campo'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { ScrollArea } from '@/components/scroll-area'
import { useCotizaciones } from '@/hooks/cotizaciones/use-cotizaciones'
import { useArmarEstudioComercial } from '@/hooks/estudio-comercial/use-armar-estudio-comercial'
import { useUfValue } from '@/hooks/uf/use-uf-value'
import { cn } from '@/lib/utils'
import { VENCIMIENTO_VARIANT } from '@/lib/badge-variants'
import { useFormik } from 'formik'
import { Loader2, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import * as Yup from 'yup'

function formatFecha(iso: string) {
	return new Date(iso).toLocaleDateString('es-CL', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})
}

function calcularEstadoVenc(fechaStr: string): string {
	const hoy = new Date()
	const venc = new Date(fechaStr)
	const diffDias = (venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
	if (diffDias < 0) return 'vencida'
	if (diffDias <= 30) return 'por_vencer'
	return 'vigente'
}

export type ConfiguracionEstudio = {
	infraseguro_primer_ejemplo: number
	infraseguro_segundo_ejemplo: number
	cantidad_cuotas: number
	monto_asegurado_actual?: number | null
	con_monto_sugerido?: boolean
}

type DialogGenerarEstudioProps = {
	fila: PanelEstudioFila
	open: boolean
	onOpenChange: (open: boolean) => void
	configuracionEstudio?: ConfiguracionEstudio
}

type SeccionForm = {
	titulo: string
	montoAsegurado: string
	numeroPropietarios: string
}

interface FormValues {
	observaciones: string
	infraseguro1: string
	infraseguro2: string
	cuotas: string
	valorUf: string
	montoAseguradoActual: string
	conMontoSugerido: string
}

export default function DialogGenerarEstudio({
	fila,
	open,
	onOpenChange,
	configuracionEstudio,
}: DialogGenerarEstudioProps) {
	const { data: cotizaciones } = useCotizaciones(fila.id)
	const armarMutation = useArmarEstudioComercial()

	const opciones = useMemo(() => cotizaciones ?? [], [cotizaciones])

	const [idsSeleccionados, setIdsSeleccionados] = useState<number[]>([])
	const [archivo, setArchivo] = useState<File | null>(null)
	const [secciones, setSecciones] = useState<SeccionForm[]>([])

	const { cargando: cargandoUf, refrescar: fetchUf } = useUfValue()

	const validationSchema = Yup.object({
		observaciones: Yup.string(),
		infraseguro1: Yup.string(),
		infraseguro2: Yup.string(),
		cuotas: Yup.number()
			.typeError('Debe ser un número')
			.min(1, 'Mínimo 1')
			.max(12, 'Máximo 12')
			.integer('Debe ser entero')
			.required('Requerido'),
		valorUf: Yup.number()
			.typeError('Debe ser un número')
			.min(0, 'Mínimo 0')
			.required('Requerido'),
		montoAseguradoActual: Yup.string(),
		conMontoSugerido: Yup.string(),
	})

	const formik = useFormik<FormValues>({
		initialValues: {
			observaciones: '',
			infraseguro1: configuracionEstudio?.infraseguro_primer_ejemplo != null
				? String(
						Math.round(
							(configuracionEstudio.infraseguro_primer_ejemplo * 100) / 10,
						) * 10,
					)
				: 'no',
			infraseguro2: configuracionEstudio?.infraseguro_segundo_ejemplo != null
				? String(
						Math.round(
							(configuracionEstudio.infraseguro_segundo_ejemplo * 100) / 10,
						) * 10,
					)
				: 'no',
			cuotas: String(configuracionEstudio?.cantidad_cuotas ?? 11),
			valorUf: '38000',
			montoAseguradoActual: configuracionEstudio?.monto_asegurado_actual != null
				? String(configuracionEstudio.monto_asegurado_actual)
				: '',
			conMontoSugerido: configuracionEstudio?.con_monto_sugerido
				? 'true'
				: 'false',
		},
		validationSchema,
		onSubmit: async values => {
			if (idsSeleccionados.length === 0) return

			const response = await armarMutation.mutateAsync({
				id_prospecto: fila.id_prospecto,
				monto_asegurado_actual: values.montoAseguradoActual
					? Number(values.montoAseguradoActual)
					: null,
				con_monto_sugerido: values.conMontoSugerido === 'true',
				infraseguro_primer_ejemplo: values.infraseguro1 && values.infraseguro1 !== 'no'
					? Number(values.infraseguro1) / 100
					: null,
				infraseguro_segundo_ejemplo: values.infraseguro2 && values.infraseguro2 !== 'no'
					? Number(values.infraseguro2) / 100
					: null,
				cantidad_cuotas: Number(values.cuotas),
				ids_cotizacion: idsSeleccionados,
				valor_uf: Number(values.valorUf),
				secciones: secciones.length > 0
					? secciones.map(s => ({
							titulo: s.titulo,
							monto_asegurado: Number(s.montoAsegurado),
							numero_propietarios: s.numeroPropietarios
								? Number(s.numeroPropietarios)
								: null,
						}))
					: null,
			})

			if (response.archivo_base64) {
				const byteChars = atob(response.archivo_base64)
				const byteNums = Array.from(byteChars, c => c.charCodeAt(0))
				const byteArray = new Uint8Array(byteNums)
				const blob = new Blob([byteArray], {
					type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				})
				const url = URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.href = url
				a.download = response.nombre_archivo
				a.click()
				URL.revokeObjectURL(url)
			}

			onOpenChange(false)
		},
	})

	const manejarUf = () => {
		fetchUf().then(v => {
			if (v != null) formik.setFieldValue('valorUf', String(v))
		})
	}

	const handleOpenChange = (next: boolean) => {
		if (next) {
			manejarUf()
		} else {
			formik.resetForm()
			setIdsSeleccionados([])
			setArchivo(null)
			setSecciones([])
		}
		onOpenChange(next)
	}

	const toggleId = (id: number) => {
		setIdsSeleccionados(prev =>
			prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
		)
	}

	const handleLimpiar = () => {
		formik.resetForm({
			values: {
				observaciones: '',
				infraseguro1: 'no',
				infraseguro2: 'no',
				cuotas: '',
				valorUf: '',
				montoAseguradoActual: '',
				conMontoSugerido: 'false',
			},
		})
		setIdsSeleccionados([])
		setArchivo(null)
		setSecciones([])
	}

	const puedeGuardar = idsSeleccionados.length > 0 && !armarMutation.isPending

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='flex max-h-[92vh] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl'>
				<DialogHeader className='shrink-0 border-b border-border px-4 py-3 pr-12'>
					<DialogTitle className='text-base'>Generar estudio</DialogTitle>
					<DialogDescription>
						Revise las cotizaciones recibidas y confirme la generación del
						estudio para el ejecutivo comercial.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={formik.handleSubmit}
					className='flex min-h-0 flex-1 flex-col'
				>
					<ScrollArea className='min-h-0 flex-1 overflow-y-auto'>
						<div className='space-y-4 px-4 py-3 text-sm'>
							<dl className='grid gap-2 rounded-md border border-border/80 bg-muted/20 p-3 text-xs sm:grid-cols-2'>
								<div>
									<dt className='text-muted-foreground'>Cliente</dt>
									<dd className='font-medium text-foreground'>
										{fila.cliente}
									</dd>
								</div>
								<div>
									<dt className='text-muted-foreground'>Línea de seguro</dt>
									<dd className='font-medium text-foreground'>
										{fila.linea_seguro}
									</dd>
								</div>
								<div className='sm:col-span-2'>
									<dt className='text-muted-foreground'>Ejecutivo comercial</dt>
									<dd className='font-medium text-foreground'>
										{fila.ejecutivo_comercial}
									</dd>
								</div>
							</dl>

							<div className='space-y-2'>
								<p className='text-xs font-medium text-foreground'>
									Cotizaciones recibidas
								</p>
								{opciones.length === 0 ? (
									<p className='rounded-md border border-dashed border-border px-3 py-4 text-xs text-muted-foreground'>
										No hay cotizaciones registradas para esta solicitud.
									</p>
								) : (
									<div className='space-y-2'>
										{opciones.map(op => {
											const ev = calcularEstadoVenc(op.fecha_vencimiento)
											const checked = idsSeleccionados.includes(op.id)
											return (
												<label
													key={op.id}
													htmlFor={`cot-chk-${op.id}`}
													className={cn(
														'flex cursor-pointer gap-3 rounded-md border bg-card px-3 py-2.5 transition-colors',
														checked
															? 'border-primary/40 bg-primary/[0.04]'
															: 'border-border/70',
													)}
												>
													<Checkbox
														id={`cot-chk-${op.id}`}
														checked={checked}
														onCheckedChange={() => toggleId(op.id)}
														className='mt-0.5'
													/>
													<div className='min-w-0 flex-1 space-y-1 text-xs'>
														<p className='font-medium text-foreground'>
															{op.company}
														</p>
														<p className='text-muted-foreground'>
															Monto asegurado:{' '}
															{op.monto_total_asegurado.toLocaleString('es-CL')}{' '}
															UF
														</p>
														<p className='text-muted-foreground'>
															Recepción: {formatFecha(op.fecha_emision)} ·
															Vence: {formatFecha(op.fecha_vencimiento)}
														</p>
														<Badge
															variant={VENCIMIENTO_VARIANT[ev]}
															className='text-[10px] font-medium'
														>
															{ev === 'vigente' && 'Vigente'}
															{ev === 'por_vencer' && 'Por vencer'}
															{ev === 'vencida' && 'Vencida'}
														</Badge>
													</div>
												</label>
											)
										})}
									</div>
								)}
								<p className='text-[10px] text-muted-foreground'>
									Seleccione una o más cotizaciones para incluir en el estudio.
								</p>
							</div>

							<div className='space-y-3 rounded-md border border-border/80 bg-muted/20 p-3'>
								<p className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
									Configuración del estudio
								</p>
								<div className='grid gap-3 sm:grid-cols-3'>
									<Campo label='Infraseguro ej. 1 (opcional)'>
										<Select
											value={formik.values.infraseguro1}
											onValueChange={v =>
												formik.setFieldValue('infraseguro1', v)
											}
										>
											<SelectTrigger className='h-9 text-sm shadow-none'>
												<SelectValue placeholder='Seleccionar %' />
											</SelectTrigger>
											<SelectContent>
												{[
													'no',
													'0',
													'10',
													'20',
													'30',
													'40',
													'50',
													'60',
													'70',
													'80',
													'90',
													'100',
												].map(v => (
													<SelectItem key={v} value={v}>
														{v === 'no' ? 'No aplicar' : `${v}%`}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Campo>
									<Campo label='Infraseguro ej. 2 (opcional)'>
										<Select
											value={formik.values.infraseguro2}
											onValueChange={v =>
												formik.setFieldValue('infraseguro2', v)
											}
										>
											<SelectTrigger className='h-9 text-sm shadow-none'>
												<SelectValue placeholder='Seleccionar %' />
											</SelectTrigger>
											<SelectContent>
												{[
													'no',
													'0',
													'10',
													'20',
													'30',
													'40',
													'50',
													'60',
													'70',
													'80',
													'90',
													'100',
												].map(v => (
													<SelectItem key={v} value={v}>
														{v === 'no' ? 'No aplicar' : `${v}%`}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Campo>
									<Campo label='Cant. cuotas'>
										<Select
											value={formik.values.cuotas}
											onValueChange={v => formik.setFieldValue('cuotas', v)}
										>
											<SelectTrigger className='h-9 text-sm shadow-none'>
												<SelectValue placeholder='Seleccionar' />
											</SelectTrigger>
											<SelectContent>
												{[
													'1',
													'2',
													'3',
													'4',
													'5',
													'6',
													'7',
													'8',
													'9',
													'10',
													'11',
													'12',
												].map(v => (
													<SelectItem key={v} value={v}>
														{v}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{formik.touched.cuotas && formik.errors.cuotas && (
											<p className='text-[10px] text-destructive'>
												{formik.errors.cuotas}
											</p>
										)}
									</Campo>
								</div>

								<Campo label='Valor UF (CLP)'>
									<div className='flex gap-2'>
										<Input
											type='number'
											step='0.01'
											min='0'
											className='h-9 flex-1 text-sm shadow-none'
											name='valorUf'
											value={formik.values.valorUf}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
										<Button
											type='button'
											variant='outline'
											size='sm'
											className='h-8 shrink-0'
											onClick={manejarUf}
											disabled={cargandoUf}
										>
											<RefreshCw
												className={cn('size-3.5', cargandoUf && 'animate-spin')}
											/>
										</Button>
									</div>
									{formik.touched.valorUf && formik.errors.valorUf && (
										<p className='text-[10px] text-destructive'>
											{formik.errors.valorUf}
										</p>
									)}
								</Campo>

								<Campo label='Monto asegurado actual (UF)'>
									<Input
										type='number'
										step='0.01'
										min='0'
										className='h-9 w-full text-sm shadow-none'
										name='montoAseguradoActual'
										value={formik.values.montoAseguradoActual}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder='Opcional'
									/>
								</Campo>

								<label className='flex items-center gap-2 rounded-md border border-border/70 bg-card px-3 py-2 text-xs'>
									<Checkbox
										checked={formik.values.conMontoSugerido === 'true'}
										onCheckedChange={checked =>
											formik.setFieldValue(
												'conMontoSugerido',
												checked ? 'true' : 'false',
											)
										}
									/>
									<span>Usar monto sugerido</span>
								</label>

								<div className='space-y-2'>
									<p className='text-xs font-medium text-foreground'>
										Secciones
									</p>
									{secciones.length === 0 ? (
										<p className='text-[11px] text-muted-foreground'>
											Sin secciones agregadas.
										</p>
									) : (
										<div className='space-y-2'>
											{secciones.map((s, i) => (
												<div
													key={i}
													className='flex flex-wrap items-end gap-2 rounded-md border border-border/70 bg-card p-2 sm:flex-nowrap'
												>
													<div className='min-w-0 flex-1 space-y-1'>
														<Label className='text-[10px]'>Título</Label>
														<Input
															className='h-7 text-xs'
															value={s.titulo}
															onChange={e => {
																const next = [...secciones]
																next[i] = {
																	...next[i],
																	titulo: e.target.value,
																}
																setSecciones(next)
															}}
														/>
													</div>
													<div className='w-full space-y-1 sm:w-32'>
														<Label className='text-[10px]'>
															Monto asegurado
														</Label>
														<Input
															type='number'
															step='0.01'
															min='0'
															className='h-7 text-xs'
															value={s.montoAsegurado}
															onChange={e => {
																const next = [...secciones]
																next[i] = {
																	...next[i],
																	montoAsegurado: e.target.value,
																}
																setSecciones(next)
															}}
														/>
													</div>
													<div className='w-full space-y-1 sm:w-20'>
														<Label className='text-[10px]'>Propietarios</Label>
														<Input
															type='number'
															min='0'
															className='h-7 text-xs'
															value={s.numeroPropietarios}
															onChange={e => {
																const next = [...secciones]
																next[i] = {
																	...next[i],
																	numeroPropietarios: e.target.value,
																}
																setSecciones(next)
															}}
														/>
													</div>
													<Button
														type='button'
														variant='ghost'
														size='sm'
														className='h-7 shrink-0 px-2 text-muted-foreground'
														onClick={() =>
															setSecciones(secciones.filter((_, j) => j !== i))
														}
													>
														<Trash2 className='size-3.5' />
													</Button>
												</div>
											))}
										</div>
									)}
									<Button
										type='button'
										variant='outline'
										size='sm'
										className='h-7 text-xs'
										onClick={() =>
											setSecciones([
												...secciones,
												{
													titulo: '',
													montoAsegurado: '',
													numeroPropietarios: '',
												},
											])
										}
									>
										<Plus className='mr-1 size-3.5' />
										Agregar sección
									</Button>
								</div>
							</div>
						</div>
					</ScrollArea>

					<DialogFooter className='shrink-0 gap-2 border-t border-border px-4 py-3'>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => onOpenChange(false)}
							disabled={armarMutation.isPending}
						>
							Cancelar
						</Button>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={handleLimpiar}
							disabled={armarMutation.isPending}
						>
							Limpiar
						</Button>
						<Button type='submit' size='sm' disabled={!puedeGuardar}>
							{armarMutation.isPending ? (
								<>
									<Loader2
										className='mr-1.5 size-3.5 animate-spin'
										aria-hidden
									/>
									Guardando…
								</>
							) : (
								'Guardar estudio'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
