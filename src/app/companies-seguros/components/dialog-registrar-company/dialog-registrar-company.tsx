'use client'

import * as Yup from 'yup'
import type {
	ActualizarCompanyRequest,
} from '@/aplicacion/companies-seguros/use-cases/actualizar-company'
import type {
	CrearCompanyRequest,
} from '@/aplicacion/companies-seguros/use-cases/crear-company'
import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import CompanySeguro from '@/dominio/company-seguro/company-seguro'
import { useActualizarCompany } from '@/hooks/companies-seguros/use-actualizar-company'
import { useCrearCompany } from '@/hooks/companies-seguros/use-crear-company'
import { useFormik } from 'formik'

type DialogRegistrarCompanyProps = {
	/** Si viene, el dialog renombra; si no, crea una compañía nueva. */
	companyEdicion?: CompanySeguro
	dialogAbierto: boolean
	cerrarDialog: () => void
}

export default function DialogRegistrarCompany({
	companyEdicion,
	dialogAbierto,
	cerrarDialog,
}: DialogRegistrarCompanyProps) {
	const crearMutation = useCrearCompany()
	const actualizarMutation = useActualizarCompany()

	const validationSchema = Yup.object({
		nombre: Yup.string().trim().required('El nombre es obligatorio'),
	})

	const formik = useFormik({
		initialValues: {
			nombre: companyEdicion ? companyEdicion.nombre : '',
		},
		validationSchema,
		enableReinitialize: true,
		onSubmit: async (values, helpers) => {
			try {
				if (companyEdicion) {
					const request: ActualizarCompanyRequest = {
						id: companyEdicion.id,
						nombre: values.nombre.trim(),
					}
					await actualizarMutation.mutateAsync(request)
				} else {
					const request: CrearCompanyRequest = {
						nombre: values.nombre.trim(),
					}
					await crearMutation.mutateAsync(request)
				}
				cerrarDialog()
			} catch {
				// El error ya se notifica globalmente (MutationCache onError).
				helpers.setSubmitting(false)
			}
		},
	})

	return (
		<Dialog open={dialogAbierto} onOpenChange={open => !open && cerrarDialog()}>
			<DialogContent>
				<DialogTitle>
					{companyEdicion ? 'Renombrar compañía' : 'Nueva compañía'}
				</DialogTitle>
				<DialogDescription>
					{companyEdicion
						? 'Modifica el nombre de la compañía de seguros.'
						: 'Completa el nombre para registrar una nueva compañía de seguros.'}
				</DialogDescription>

				<form onSubmit={formik.handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='nombre'>Nombre *</Label>
						<Input
							id='nombre'
							name='nombre'
							value={formik.values.nombre}
							onChange={formik.handleChange}
							placeholder='Nombre de la compañía'
						/>
						{formik.touched.nombre && formik.errors.nombre && (
							<p className='text-xs text-destructive'>{formik.errors.nombre}</p>
						)}
					</div>

					<div className='flex justify-end gap-2'>
						<Button type='button' variant='outline' onClick={cerrarDialog}>
							Cancelar
						</Button>
						<Button
							type='submit'
							disabled={formik.isSubmitting || !formik.isValid}
						>
							{formik.isSubmitting
								? 'Guardando...'
								: companyEdicion
									? 'Guardar cambios'
									: 'Crear compañía'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
