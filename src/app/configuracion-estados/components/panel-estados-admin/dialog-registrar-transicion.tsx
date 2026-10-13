'use client'

import {
	EstadoConfiguracion,
} from '@/aplicacion/estados-admin/dto/estado-configuracion'
import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { Switch } from '@/components/switch'
import { useCrearTransicion } from '@/hooks/estados-admin/use-crear-transicion'
import { useFormik } from 'formik'
import * as Yup from 'yup'

type DialogRegistrarTransicionProps = {
	/** Estado de origen de la nueva transición. */
	estado: EstadoConfiguracion
	/** Estados que aún no se usan como destino desde el origen. */
	destinos: EstadoConfiguracion[]
	dialogAbierto: boolean
	cerrarDialog: () => void
}

const VALOR_NINGUNO = '__ninguno__'

/**
 * Registra una transición SECUNDARIA.
 *
 * Las transiciones principales (camino feliz + SLA del estado) no se crean
 * desde la aplicación: se siembran por migración de base de datos.
 */
export default function DialogRegistrarTransicion({
	estado,
	destinos,
	dialogAbierto,
	cerrarDialog,
}: DialogRegistrarTransicionProps) {
	const crearMutation = useCrearTransicion()

	const validationSchema = Yup.object({
		codigoEstadoDestino: Yup.string()
			.required('Debes seleccionar un estado destino')
			.notOneOf([VALOR_NINGUNO], 'Debes seleccionar un estado destino'),
		esManual: Yup.boolean(),
		accionRequerida: Yup.string().when('esManual', {
			is: true,
			then: schema =>
				schema.max(
					250,
					'La acción requerida no puede superar los 250 caracteres',
				),
			otherwise: schema => schema,
		}),
	})

	const formik = useFormik({
		initialValues: {
			codigoEstadoDestino: VALOR_NINGUNO,
			esManual: true,
			accionRequerida: '',
		},
		validationSchema,
		enableReinitialize: true,
		onSubmit: async (values, helpers) => {
			try {
				await crearMutation.mutateAsync({
					codigo_estado_origen: estado.codigo,
					codigo_estado_destino: values.codigoEstadoDestino,
					es_manual: values.esManual,
					accion_requerida: values.accionRequerida.trim()
						? values.accionRequerida.trim()
						: null,
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
				<DialogTitle>Nueva transición</DialogTitle>
				<DialogDescription>
					Define un camino de salida desde «{estado.nombre}» hacia otro estado
					del proceso comercial.
				</DialogDescription>

				<form onSubmit={formik.handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='codigoEstadoDestino'>Estado destino *</Label>
						<Select
							value={formik.values.codigoEstadoDestino}
							onValueChange={valor =>
								formik.setFieldValue('codigoEstadoDestino', valor)
							}
						>
							<SelectTrigger id='codigoEstadoDestino' className='w-full'>
								<SelectValue placeholder='Selecciona un estado' />
							</SelectTrigger>
							<SelectContent>
								{destinos.map(destino => (
									<SelectItem key={destino.codigo} value={destino.codigo}>
										{destino.nombre}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{formik.touched.codigoEstadoDestino &&
							formik.errors.codigoEstadoDestino && (
								<p className='text-xs text-destructive'>
									{formik.errors.codigoEstadoDestino}
								</p>
							)}
					</div>

					<div className='flex items-center justify-between gap-3 rounded-lg border border-border p-3'>
						<div className='min-w-0'>
							<Label htmlFor='esManual'>Transición manual</Label>
							<p className='text-xs text-muted-foreground'>
								El ejecutivo la dispara desde la oportunidad.
							</p>
						</div>
						<Switch
							id='esManual'
							checked={formik.values.esManual}
							onCheckedChange={valor =>
								formik.setFieldValue('esManual', valor)
							}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='accionRequerida'>Acción requerida</Label>
						<Input
							id='accionRequerida'
							name='accionRequerida'
							value={formik.values.accionRequerida}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							disabled={!formik.values.esManual}
							placeholder='Ej: cargar cotizaciones'
						/>
						<p className='text-xs text-muted-foreground'>
							Texto que se muestra al ejecutivo como indicación de la transición.
						</p>
						{formik.touched.accionRequerida &&
							formik.errors.accionRequerida && (
								<p className='text-xs text-destructive'>
									{formik.errors.accionRequerida}
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
							{formik.isSubmitting ? 'Guardando...' : 'Crear transición'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
