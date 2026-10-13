'use client'

import { EstadoConfiguracion } from '@/aplicacion/estados-admin/dto/estado-configuracion'
import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { useActualizarEstadoConfiguracion } from '@/hooks/estados-admin/use-actualizar-estado-configuracion'
import { useFormik } from 'formik'
import * as Yup from 'yup'

type DialogConfigurarEstadoProps = {
	/** Estado cuya configuración se edita. */
	estado?: EstadoConfiguracion
	dialogAbierto: boolean
	cerrarDialog: () => void
}

/**
 * Edita la probabilidad de cierre de un estado.
 *
 * Los días límite de permanencia (SLA) ya no se configuran acá: viven en la
 * transición principal del estado y se editan desde el panel de transiciones.
 *
 * La probabilidad se ingresa en la UI como porcentaje (0-100) y se envía
 * al backend como decimal (0-1).
 */
export default function DialogConfigurarEstado({
	estado,
	dialogAbierto,
	cerrarDialog,
}: DialogConfigurarEstadoProps) {
	const actualizarMutation = useActualizarEstadoConfiguracion()

	const validationSchema = Yup.object({
		probabilidadPorcentaje: Yup.number()
			.typeError('La probabilidad debe ser un número')
			.min(0, 'La probabilidad no puede ser menor a 0%')
			.max(100, 'La probabilidad no puede superar el 100%')
			.required('La probabilidad de cierre es obligatoria'),
	})

	const formik = useFormik({
		initialValues: {
			probabilidadPorcentaje: estado
				? String(Math.round(estado.probabilidad_cierre * 100))
				: '',
		},
		validationSchema,
		enableReinitialize: true,
		onSubmit: async (values, helpers) => {
			if (!estado) return

			try {
				await actualizarMutation.mutateAsync({
					codigo: estado.codigo,
					probabilidad_cierre: Number(values.probabilidadPorcentaje) / 100,
				})
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
				<DialogTitle>Configurar estado</DialogTitle>
				<DialogDescription>
					{estado
						? `Define la probabilidad de cierre de "${estado.nombre}".`
						: 'Define la probabilidad de cierre del estado.'}
				</DialogDescription>

				<form onSubmit={formik.handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='probabilidadPorcentaje'>
							Probabilidad de cierre (%)
						</Label>
						<Input
							id='probabilidadPorcentaje'
							name='probabilidadPorcentaje'
							type='number'
							min={0}
							max={100}
							step={1}
							value={formik.values.probabilidadPorcentaje}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							placeholder='0'
						/>
						<p className='text-xs text-muted-foreground'>
							Probabilidad con la que el sistema estima el cierre de la
							oportunidad al estar en este estado. Ingresa un valor entre 0 y
							100.
						</p>
						{formik.touched.probabilidadPorcentaje &&
							formik.errors.probabilidadPorcentaje && (
								<p className='text-xs text-destructive'>
									{formik.errors.probabilidadPorcentaje}
								</p>
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
							{formik.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
