'use client'

import { useFormik } from 'formik'
import { Building2, Loader2 } from 'lucide-react'
import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { useActualizarAdministrador } from '@/hooks/administradores/use-actualizar-administrador'
import type AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'
import * as Yup from 'yup'

type DialogoActualizarAdministradorProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	administrador: AdministradorCondominio
	onAdministradorActualizado?: (administrador: AdministradorCondominio) => void
}

type FormValues = {
	nombre_administrador: string
	nombre_contacto: string
	telefono: string
	correo: string
}

const validationSchema = Yup.object({
	nombre_administrador: Yup.string().required('El nombre es obligatorio'),
	correo: Yup.string().email('Correo inválido').nullable(),
})

export default function DialogoActualizarAdministrador({
	open,
	onOpenChange,
	administrador,
	onAdministradorActualizado,
}: DialogoActualizarAdministradorProps) {
	const mutation = useActualizarAdministrador()

	const formik = useFormik<FormValues>({
		initialValues: {
			nombre_administrador: administrador.nombre_administrador,
			nombre_contacto: administrador.nombre_contacto ?? '',
			telefono: administrador.telefono ?? '',
			correo: administrador.correo ?? '',
		},
		validationSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			const admin = await mutation.mutateAsync({
				id: administrador.id,
				data: {
					nombre_administrador: values.nombre_administrador,
					nombre_contacto: values.nombre_contacto || null,
					telefono: values.telefono || null,
					correo: values.correo || null,
				},
			})
			formik.resetForm()
			onAdministradorActualizado?.(admin)
			onOpenChange(false)
		},
	})

	function handleOpenChange(open: boolean) {
		if (!open) {
			formik.resetForm()
		}
		onOpenChange(open)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='max-w-md gap-0 p-0'>
				<div className='border-b border-border px-6 py-4'>
					<DialogHeader className='gap-1'>
						<DialogTitle className='flex items-center gap-2 text-lg font-semibold'>
							<Building2 className='size-5 text-muted-foreground' />
							Actualizar administrador
						</DialogTitle>
						<p className='text-sm text-muted-foreground'>
							Actualiza los datos del administrador de condominio.
						</p>
					</DialogHeader>
				</div>

				<form
					id='form-dialogo-actualizar-administrador'
					onSubmit={formik.handleSubmit}
					className='space-y-3 px-6 py-4'
				>
					<div className='space-y-1.5'>
						<Label className='text-xs'>
							Nombre del administrador
							<span className='text-destructive'>*</span>
						</Label>
						<Input
							className='h-9 text-sm'
							{...formik.getFieldProps('nombre_administrador')}
						/>
						{formik.touched.nombre_administrador && formik.errors.nombre_administrador && (
							<p className='text-xs font-medium text-destructive'>{formik.errors.nombre_administrador}</p>
						)}
					</div>

					<div className='grid gap-3 sm:grid-cols-2'>
						<div className='space-y-1.5'>
							<Label className='text-xs'>Nombre de contacto</Label>
							<Input
								className='h-9 text-sm'
								{...formik.getFieldProps('nombre_contacto')}
							/>
						</div>

						<div className='space-y-1.5'>
							<Label className='text-xs'>Teléfono</Label>
							<Input
								className='h-9 text-sm'
								{...formik.getFieldProps('telefono')}
							/>
						</div>
					</div>

					<div className='space-y-1.5'>
						<Label className='text-xs'>Correo</Label>
						<Input
							type='email'
							className='h-9 text-sm'
							{...formik.getFieldProps('correo')}
						/>
						{formik.touched.correo && formik.errors.correo && (
							<p className='text-xs font-medium text-destructive'>{formik.errors.correo}</p>
						)}
					</div>

					{mutation.isError && (
						<p className='text-xs font-medium text-destructive' role='alert'>
							{mutation.error instanceof Error
								? mutation.error.message
								: 'Error al actualizar administrador'}
						</p>
					)}
				</form>

				<div className='border-t border-border px-6 py-4'>
					<DialogFooter className='gap-2 sm:gap-0'>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => handleOpenChange(false)}
							disabled={formik.isSubmitting}
						>
							Cancelar
						</Button>
						<Button
							type='submit'
							size='sm'
							form='form-dialogo-actualizar-administrador'
							disabled={formik.isSubmitting}
						>
							{formik.isSubmitting ? (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden />
							) : null}
							Actualizar
						</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	)
}
