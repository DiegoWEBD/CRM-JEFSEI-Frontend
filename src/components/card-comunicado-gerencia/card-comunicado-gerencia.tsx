'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/dialog'
import Input from '@/components/forms/input/input'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import Textarea from '@/components/forms/text-area/text-area'
import { Label } from '@/components/label'
import { useComunicadosGerencia } from '@/hooks/comunicados-gerencia/use-comunicados-gerencia'
import { useRegistrarComunicadoGerencia } from '@/hooks/comunicados-gerencia/use-registrar-comunicado-gerencia'
import { formatearFecha } from '@/utils/formatear-fecha'
import { useFormik } from 'formik'
import { Bell, Plus } from 'lucide-react'
import { useState } from 'react'
import * as Yup from 'yup'
import PermissionGuard from '../layouts/guards/permission-guard'

const PRIORIDAD_VARIANT = {
	media: 'pastel-blue',
	alta: 'pastel-red',
} as const

export default function CardComunicadoGerencia() {
	const { data: comunicados } = useComunicadosGerencia()
	const mutation = useRegistrarComunicadoGerencia()
	const [dialogAbierto, setDialogAbierto] = useState(false)

	const formik = useFormik({
		initialValues: {
			titulo: '',
			descripcion: '',
			prioridad: 'media',
			caducidad: '',
		},
		validationSchema: Yup.object({
			titulo: Yup.string().required('El título es obligatorio'),
			descripcion: Yup.string().required('La descripción es obligatoria'),
			prioridad: Yup.string()
				.oneOf(['media', 'alta'], 'Selecciona una prioridad')
				.required(),
			caducidad: Yup.string().required('La fecha de caducidad es obligatoria'),
		}),
		onSubmit: values => {
			mutation.mutate(
				{
					titulo: values.titulo,
					descripcion: values.descripcion,
					prioridad: values.prioridad,
					caducidad: values.caducidad,
				},
				{
					onSuccess: () => {
						setDialogAbierto(false)
						formik.resetForm()
					},
				},
			)
		},
	})

	return (
		<Card className='border-border bg-card'>
			<CardHeader className='flex flex-row items-center justify-between border-b border-border pb-2 pt-3'>
				<CardTitle primary>Avisos de gerencia</CardTitle>
				<div className='flex items-center gap-2'>
					<PermissionGuard allowedPermissions={['CREAR_COMUNICADO']}>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='h-8 gap-1 text-xs'
							onClick={() => setDialogAbierto(true)}
						>
							<Plus className='h-3.5 w-3.5' aria-hidden />
							Nuevo aviso
						</Button>
					</PermissionGuard>
					<Bell className='h-4 w-4 text-muted-foreground' aria-hidden />
				</div>
			</CardHeader>
			<CardContent className='space-y-2 p-3 sm:p-4'>
				{comunicados?.length === 0 && (
					<p className='py-3 text-center text-xs text-muted-foreground'>
						Sin avisos relevantes por ahora.
					</p>
				)}
				<div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
					{comunicados?.map(aviso => (
						<div
							key={aviso.id}
							className='rounded-md border border-border/80 px-3 py-2 text-xs'
						>
							<div className='flex items-start justify-between gap-2'>
								<p className='font-medium text-foreground'>{aviso.titulo}</p>
								<Badge
									variant={
										PRIORIDAD_VARIANT[
											aviso.prioridad as keyof typeof PRIORIDAD_VARIANT
										] ?? 'outline'
									}
									className='h-5 shrink-0 text-xs'
								>
									{aviso.prioridad}
								</Badge>
							</div>
							<p className='mt-1 leading-snug text-muted-foreground'>
								{aviso.descripcion}
							</p>
							<p className='mt-1 text-xs tabular-nums text-muted-foreground'>
								{formatearFecha(new Date(aviso.fecha), 'dd/MM/yyyy')}
							</p>
						</div>
					))}
				</div>
			</CardContent>

			<Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
				<DialogContent className='p-0 sm:max-w-md'>
					<div className='border-b border-border px-6 py-4'>
						<DialogTitle className='text-lg font-semibold'>
							Nuevo aviso
						</DialogTitle>
						<DialogDescription className='text-sm text-muted-foreground'>
							Crea un nuevo aviso o comunicado de gerencia.
						</DialogDescription>
					</div>
					<form onSubmit={formik.handleSubmit}>
						<div className='space-y-4 px-6 py-4'>
							<div className='space-y-1.5'>
								<Label className='text-xs'>Título</Label>
								<Input
									name='titulo'
									value={formik.values.titulo}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className='h-9 text-sm shadow-none'
								/>
								{formik.touched.titulo && formik.errors.titulo && (
									<p className='text-xs text-destructive'>
										{formik.errors.titulo}
									</p>
								)}
							</div>
							<div className='space-y-1.5'>
								<Label className='text-xs'>Descripción</Label>
								<Textarea
									name='descripcion'
									value={formik.values.descripcion}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className='min-h-20 text-sm shadow-none'
								/>
								{formik.touched.descripcion && formik.errors.descripcion && (
									<p className='text-xs text-destructive'>
										{formik.errors.descripcion}
									</p>
								)}
							</div>
							<div className='grid grid-cols-2 gap-3'>
								<div className='space-y-1.5'>
									<Label className='text-xs'>Prioridad</Label>
									<Select
										value={formik.values.prioridad}
										onValueChange={v => formik.setFieldValue('prioridad', v)}
									>
										<SelectTrigger className='h-9 text-sm shadow-none'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='media'>Media</SelectItem>
											<SelectItem value='alta'>Alta</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-1.5'>
									<Label className='text-xs'>Caducidad</Label>
									<Input
										type='date'
										name='caducidad'
										value={formik.values.caducidad}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										className='h-9 text-sm shadow-none'
									/>
									{formik.touched.caducidad && formik.errors.caducidad && (
										<p className='text-xs text-destructive'>
											{formik.errors.caducidad}
										</p>
									)}
								</div>
							</div>
						</div>
						<div className='flex items-center justify-end gap-2 border-t border-border px-6 py-4'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								className='h-9 text-xs'
								onClick={() => setDialogAbierto(false)}
							>
								Cancelar
							</Button>
							<Button type='submit' size='sm' className='h-9 text-xs'>
								Guardar
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</Card>
	)
}
