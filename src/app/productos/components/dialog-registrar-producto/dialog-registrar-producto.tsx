import * as Yup from 'yup'
import { ActualizarProductoRequest } from '@/aplicacion/producto/use-cases/actualizar-producto'
import { Button } from '@/components/button'
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from '@/components/dialog'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/select'
import Producto from '@/dominio/producto/producto'
import { useActualizarProducto } from '@/hooks/productos/use-actualizar-producto'
import { useCrearProducto } from '@/hooks/productos/use-crear-producto'
import { useFormik } from 'formik'
import { CrearProductoRequest } from '@/aplicacion/producto/use-cases/crear-producto'

type DialogRegistrarProductoProps = {
	productoEdicion?: Producto
	dialogAbierto: boolean
	cerrarDialog: () => void
	lineasNegocio: { id: number; nombre: string }[] | undefined
}

export default function DialogRegistrarProducto({
	productoEdicion,
	dialogAbierto,
	cerrarDialog,
	lineasNegocio,
}: DialogRegistrarProductoProps) {
	const crearMutation = useCrearProducto()
	const actualizarMutation = useActualizarProducto()

	const productoValidationSchema = Yup.object({
		nombre: Yup.string().trim().required('El nombre es obligatorio'),
		id_linea_negocio: Yup.number()
			.required('La línea de negocio es obligatoria')
			.min(1, 'La línea de negocio es obligatoria'),
		codigo: Yup.string().nullable(),
	})

	const formik = useFormik({
		initialValues: {
			nombre: productoEdicion ? productoEdicion.nombre : '',
			id_linea_negocio: productoEdicion ? productoEdicion.id_linea_negocio : 0,
			codigo: productoEdicion ? productoEdicion.codigo : '',
		},
		validationSchema: productoValidationSchema,
		enableReinitialize: true,
		onSubmit: async values => {
			if (productoEdicion) {
				const request: ActualizarProductoRequest = {
					id: productoEdicion.id,
					nombre: values.nombre.trim(),
					id_linea_negocio: values.id_linea_negocio,
					codigo: values.codigo || null,
				}
				await actualizarMutation.mutateAsync(request)
			} else {
				const request: CrearProductoRequest = {
					nombre: values.nombre.trim(),
					id_linea_negocio: values.id_linea_negocio,
					codigo: values.codigo || null,
				}
				await crearMutation.mutateAsync(request)
			}
			cerrarDialog()
		},
	})

	return (
		<Dialog open={dialogAbierto} onOpenChange={open => !open && cerrarDialog()}>
			<DialogContent>
				<DialogTitle>
					{productoEdicion ? 'Editar producto' : 'Nuevo producto'}
				</DialogTitle>
				<DialogDescription>
					{productoEdicion
						? 'Modifica los datos del producto.'
						: 'Completa los datos para registrar un nuevo producto.'}
				</DialogDescription>

				<form onSubmit={formik.handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='nombre'>Nombre *</Label>
						<Input
							id='nombre'
							name='nombre'
							value={formik.values.nombre}
							onChange={formik.handleChange}
							placeholder='Nombre del producto'
						/>
						{formik.touched.nombre && formik.errors.nombre && (
							<p className='text-xs text-destructive'>{formik.errors.nombre}</p>
						)}
					</div>

					<div className='space-y-2'>
						<Label htmlFor='id_linea_negocio'>Línea de negocio *</Label>
						<Select
							value={
								formik.values.id_linea_negocio
									? formik.values.id_linea_negocio.toString()
									: ''
							}
							onValueChange={value =>
								formik.setFieldValue('id_linea_negocio', Number(value))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder='Seleccionar línea' />
							</SelectTrigger>
							<SelectContent>
								{lineasNegocio?.map(ln => (
									<SelectItem key={ln.id} value={ln.id.toString()}>
										{ln.nombre}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{formik.touched.id_linea_negocio &&
							formik.errors.id_linea_negocio && (
								<p className='text-xs text-destructive'>
									{formik.errors.id_linea_negocio}
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
							{formik.isSubmitting
								? 'Guardando...'
								: productoEdicion
									? 'Guardar cambios'
									: 'Crear producto'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
