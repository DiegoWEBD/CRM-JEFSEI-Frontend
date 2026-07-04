'use client'

import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { useRegistrarRecordatorio } from '@/hooks/recordatorios/use-registrar-recordatorio'
import { formatearFecha } from '@/utils/formatear-fecha'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/button'
import Calendario from '../calendario/calendario'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog'
import Input from '../forms/input/input'
import Select from '../forms/select/select'
import SelectContent from '../forms/select/select-content/select-content'
import SelectItem from '../forms/select/select-item/select-item'
import SelectTrigger from '../forms/select/select-trigger/select-trigger'
import SelectValue from '../forms/select/select-value/select-value'
import Textarea from '../forms/text-area/text-area'
import RecordatoriosUsuario from './recordatorios-usuario/recordatorios-usuario'
import { useFormik } from 'formik'
import * as Yup from 'yup'

type CardCalendarioProps = {
	prospectos?: ProspectoResumenJson[]
}

export default function CardCalendario({ prospectos }: CardCalendarioProps) {
	const [diaSeleccionado, setDiaSeleccionado] = useState<string>(
		formatearFecha(new Date(), 'yyyy-MM-dd'),
	)
	const [openModalCrearRecordatorio, setOpenModalCrearRecordatorio] =
		useState<boolean>(false)

	const [fechaActual, setFechaActual] = useState(() => new Date())
	const hoyIso = useMemo(() => formatearFecha(new Date(), 'yyyy-MM-dd'), [])

	const diasCalendario = useMemo(() => {
		const anio = fechaActual.getFullYear()
		const mes = fechaActual.getMonth()
		const primerDiaMes = new Date(anio, mes, 1)
		const offsetLunes = (primerDiaMes.getDay() + 6) % 7
		const inicio = new Date(primerDiaMes)
		inicio.setDate(primerDiaMes.getDate() - offsetLunes)
		return Array.from({ length: 35 }, (_, i) => {
			const d = new Date(inicio)
			d.setDate(inicio.getDate() + i)
			const iso = formatearFecha(d, 'yyyy-MM-dd')

			return {
				iso,
				dia: d.getDate(),
				esMesActual: d.getMonth() === mes && d.getFullYear() === anio,
				esHoy: iso === hoyIso,
				tieneRecordatorio: false,
			}
		})
	}, [fechaActual, hoyIso])

	const mutation = useRegistrarRecordatorio()

	const formik = useFormik({
		initialValues: {
			idProspecto: '',
			titulo: '',
			fecha: hoyIso,
			hora: '09:00',
			prioridad: 'normal',
			tipoGestion: 'llamada',
			detalle: '',
		},
		validationSchema: Yup.object({
			titulo: Yup.string().required('El título es obligatorio'),
			fecha: Yup.string().required('La fecha es obligatoria'),
			hora: Yup.string().required('La hora es obligatoria'),
			prioridad: Yup.string()
				.oneOf(['normal', 'alta'], 'Selecciona una prioridad')
				.required(),
			tipoGestion: Yup.string()
				.oneOf(
					['llamada', 'correo', 'visita', 'whatsapp', 'reunion', 'otro'],
					'Selecciona un tipo',
				)
				.required(),
		}),
		onSubmit: values => {
			const fechaRecordatorio = `${values.fecha}T${values.hora}:00`

			mutation.mutate(
				{
					titulo: values.titulo,
					detalle: values.detalle || null,
					prioridad: values.prioridad,
					tipo_gestion: values.tipoGestion,
					fecha_recordatorio: fechaRecordatorio,
					id_prospecto: values.idProspecto ? Number(values.idProspecto) : null,
				},
				{
					onSuccess: () => {
						setOpenModalCrearRecordatorio(false)
						formik.resetForm()
					},
				},
			)
		},
	})

	return (
		<Card className='min-w-0 border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border px-3 pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between sm:px-4'>
				<CardTitle className='min-w-0' primary>
					Calendario y recordatorios
				</CardTitle>
				<Button
					type='button'
					size='sm'
					className='h-8 w-full shrink-0 gap-1 text-xs sm:w-auto'
					onClick={() => setOpenModalCrearRecordatorio(true)}
				>
					<Plus className='h-3.5 w-3.5' aria-hidden />
					Nuevo recordatorio
				</Button>
			</CardHeader>
			<CardContent className='grid min-w-0 gap-4 p-3 sm:p-4 lg:grid-cols-2 lg:gap-5'>
				<div className='min-w-0 space-y-2'>
					<div className='flex items-center justify-between gap-2'>
						<div className='flex items-center gap-1'>
							<button
								type='button'
								className='flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground'
								onClick={() =>
									setFechaActual(
										prev => new Date(prev.getFullYear(), prev.getMonth() - 1),
									)
								}
							>
								<ChevronLeft className='h-3.5 w-3.5' aria-hidden />
							</button>
							<Select
								value={fechaActual.getMonth().toString()}
								onValueChange={value =>
									setFechaActual(
										prev =>
											new Date(prev.getFullYear(), Number(value)),
									)
								}
							>
								<SelectTrigger className='h-6 w-[110px] border-none px-1 text-xs font-medium capitalize text-foreground shadow-none hover:bg-muted'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{[
										'Enero',
										'Febrero',
										'Marzo',
										'Abril',
										'Mayo',
										'Junio',
										'Julio',
										'Agosto',
										'Septiembre',
										'Octubre',
										'Noviembre',
										'Diciembre',
									].map((nombre, idx) => (
										<SelectItem
											key={idx}
											value={idx.toString()}
											className='text-xs'
										>
											{nombre}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								value={fechaActual.getFullYear().toString()}
								onValueChange={value =>
									setFechaActual(
										prev =>
											new Date(Number(value), prev.getMonth()),
									)
								}
							>
								<SelectTrigger className='h-6 w-[88px] border-none px-1 text-xs font-medium text-foreground shadow-none hover:bg-muted'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Array.from(
										{ length: 11 },
										(_, i) => new Date().getFullYear() - 5 + i,
									).map(anio => (
										<SelectItem
											key={anio}
											value={anio.toString()}
											className='text-xs'
										>
											{anio}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<button
								type='button'
								className='flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground'
								onClick={() =>
									setFechaActual(
										prev => new Date(prev.getFullYear(), prev.getMonth() + 1),
									)
								}
							>
								<ChevronRight className='h-3.5 w-3.5' aria-hidden />
							</button>
						</div>
						<p className='text-[10px] tabular-nums text-muted-foreground'>
							Hoy: {formatearFecha(new Date(), 'dd/MM/yyyy')}
						</p>
					</div>
					<Calendario
						dias={diasCalendario}
						diaSeleccionado={diaSeleccionado}
						onSeleccionarDia={setDiaSeleccionado}
					/>
					<p className='flex items-center gap-1.5 text-[10px] text-muted-foreground'>
						<span
							className='inline-block h-1.5 w-1.5 rounded-full bg-primary'
							aria-hidden
						/>
						Día con recordatorios
					</p>
				</div>

				<RecordatoriosUsuario fecha={diaSeleccionado} />
			</CardContent>

			<Dialog
				open={openModalCrearRecordatorio}
				onOpenChange={setOpenModalCrearRecordatorio}
			>
				<DialogContent className='max-w-md'>
					<DialogHeader>
						<DialogTitle>Crear recordatorio</DialogTitle>
						<DialogDescription>
							Asocia recordatorios comerciales al calendario del día.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={formik.handleSubmit}>
						<div className='space-y-3'>
							<Select
								value={formik.values.idProspecto}
								onValueChange={v => formik.setFieldValue('idProspecto', v)}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Cliente asociado (opcional)' />
								</SelectTrigger>
								<SelectContent>
									{prospectos?.map(prospecto => (
										<SelectItem
											key={prospecto.id}
											value={prospecto.id.toString()}
										>
											{prospecto.nombre_riesgo}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Input
								placeholder='Título'
								name='titulo'
								value={formik.values.titulo}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							{formik.touched.titulo && formik.errors.titulo && (
								<p className='text-[10px] text-destructive'>{formik.errors.titulo}</p>
							)}
							<div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
								<Input
									type='date'
									name='fecha'
									value={formik.values.fecha}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								<Input
									type='time'
									name='hora'
									value={formik.values.hora}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
							</div>
							<div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
								<Select
									value={formik.values.prioridad}
									onValueChange={v => formik.setFieldValue('prioridad', v)}
								>
									<SelectTrigger className='w-full'>
										<SelectValue placeholder='Prioridad' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='normal'>Normal</SelectItem>
										<SelectItem value='alta'>Alta</SelectItem>
									</SelectContent>
								</Select>
								<Select
									value={formik.values.tipoGestion}
									onValueChange={v => formik.setFieldValue('tipoGestion', v)}
								>
									<SelectTrigger className='w-full'>
										<SelectValue placeholder='Tipo' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='llamada'>Llamada</SelectItem>
										<SelectItem value='correo'>Correo</SelectItem>
										<SelectItem value='whatsapp'>Mensaje</SelectItem>
										<SelectItem value='visita'>Visita</SelectItem>
										<SelectItem value='reunion'>Reunión</SelectItem>
										<SelectItem value='otro'>General</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Textarea
								placeholder='Detalle (opcional)'
								name='detalle'
								value={formik.values.detalle}
								onChange={formik.handleChange}
							/>
						</div>
						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => setOpenModalCrearRecordatorio(false)}
							>
								Cancelar
							</Button>
							<Button type='submit' size='sm'>
								Guardar
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Card>
	)
}
