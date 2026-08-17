'use client'

import { Button } from '@/components/button'
import Input from '@/components/forms/input/input'
import Label from '@/components/forms/label/label'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export type FormularioContactoValues = {
	nombre: string
	cargo: string
	telefono: string
	correo: string
}

type FormularioContactoProps = {
	initialValues: FormularioContactoValues
	onSubmit: (values: FormularioContactoValues) => void | Promise<void>
	onCancel: () => void
	cargando?: boolean
}

const validationSchema = Yup.object({
	nombre: Yup.string().required('El nombre es obligatorio'),
	cargo: Yup.string().nullable(),
	telefono: Yup.string().nullable(),
	correo: Yup.string().email('Correo inválido').nullable(),
})

export default function FormularioContacto({
	initialValues,
	onSubmit,
	onCancel,
	cargando,
}: FormularioContactoProps) {
	const formik = useFormik<FormularioContactoValues>({
		initialValues,
		validationSchema,
		onSubmit: async values => {
			await onSubmit(values)
		},
	})

	return (
		<form onSubmit={formik.handleSubmit} className='space-y-4'>
			<div className='grid gap-4 sm:grid-cols-2'>
				<div className='space-y-1.5'>
					<Label className='text-xs'>Nombre (*)</Label>
					<Input
						name='nombre'
						value={formik.values.nombre}
						onChange={formik.handleChange}
						autoComplete='off'
						className='h-9 text-sm shadow-none'
					/>
					{formik.errors.nombre && formik.touched.nombre && (
						<p className='text-xs text-destructive'>
							{formik.errors.nombre}
						</p>
					)}
				</div>
				<div className='space-y-1.5'>
					<Label className='text-xs'>Cargo</Label>
					<Input
						name='cargo'
						value={formik.values.cargo}
						onChange={formik.handleChange}
						autoComplete='off'
						className='h-9 text-sm shadow-none'
					/>
				</div>
				<div className='space-y-1.5'>
					<Label className='text-xs'>Teléfono</Label>
					<Input
						name='telefono'
						inputMode='tel'
						value={formik.values.telefono}
						onChange={formik.handleChange}
						autoComplete='off'
						className='h-9 text-sm shadow-none'
					/>
				</div>
				<div className='space-y-1.5'>
					<Label className='text-xs'>Correo</Label>
					<Input
						name='correo'
						type='email'
						value={formik.values.correo}
						onChange={formik.handleChange}
						autoComplete='off'
						className='h-9 text-sm shadow-none'
					/>
					{formik.errors.correo && formik.touched.correo && (
						<p className='text-xs text-destructive'>
							{formik.errors.correo}
						</p>
					)}
				</div>
			</div>
			<div className='flex flex-wrap justify-end gap-2 border-t border-border pt-3'>
				<Button
					type='button'
					variant='outline'
					size='sm'
					className='h-9 text-xs shadow-none'
					onClick={onCancel}
					disabled={cargando}
				>
					Cancelar
				</Button>
				<Button
					type='submit'
					size='sm'
					className='h-9 text-xs shadow-none'
					disabled={cargando}
				>
					Guardar
				</Button>
			</div>
		</form>
	)
}
