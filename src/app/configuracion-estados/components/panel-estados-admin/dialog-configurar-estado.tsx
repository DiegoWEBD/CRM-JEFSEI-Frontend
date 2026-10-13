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
 * Edita los dos atributos configurables de un estado:
 * los días límite de permanencia (SLA) y la probabilidad de cierre.
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
		diasLimite: Yup.string()
			.trim()
			.test(
				'entero-no-negativo',
				'Los días límite deben ser un número entero no negativo',
				value => !value || /^\d+$/.test(value),
			),
		probabilidadPorcentaje: Yup.number()
			.typeError('La probabilidad debe ser un número')
			.min(0, 'La probabilidad no puede ser menor a 0%')
			.max(100, 'La probabilidad no puede superar el 100%')
			.required('La probabilidad de cierre es obligatoria'),
	})

	const formik = useFormik({
		initialValues: {
			diasLimite:
				estado?.dias_limite === null || estado?.dias_limite === undefined
					? ''
					: String(estado.dias_limite),
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
					dias_limite: values.diasLimite
						? Number(values.diasLimite)
						: null,
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
						? `Define los días límite de permanencia y la probabilidad de cierre de "${estado.nombre}".`
						: 'Define los días límite de permanencia y la probabilidad de cierre del estado.'}
				</DialogDescription>

				<form onSubmit={formik.handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='diasLimite'>Días límite</Label>
						<Input
							id='diasLimite'
							name='diasLimite'
							type='number'
							min={0}
							step={1}
							value={formik.values.diasLimite}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							placeholder='Sin límite'
						/>
						<p className='text-xs text-muted-foreground'>
							Cantidad máxima de días que una oportunidad puede permanecer en
							este estado antes de generar alertas SLA. Déjalo vacío para no
							tener límite.
						</p>
						{formik.touched.diasLimite && formik.errors.diasLimite && (
							<p className='text-xs text-destructive'>
								{formik.errors.diasLimite}
							</p>
						)}
					</div>

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
