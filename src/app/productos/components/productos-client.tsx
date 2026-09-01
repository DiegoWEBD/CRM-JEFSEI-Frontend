'use client'

import { ObtenerProductosResponse } from '@/aplicacion/producto/dtos/obtener-productos-response'
import { ActualizarProductoRequest } from '@/aplicacion/producto/use-cases/actualizar-producto'
import { CrearProductoRequest } from '@/aplicacion/producto/use-cases/crear-producto'
import { Button } from '@/components/button'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/dialog'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import Producto from '@/dominio/producto/producto'
import { useLineasNegocio } from '@/hooks/lineas-negocio/use-lineas-negocio'
import { useActualizarProducto } from '@/hooks/productos/use-actualizar-producto'
import { useCrearProducto } from '@/hooks/productos/use-crear-producto'
import { useEliminarProducto } from '@/hooks/productos/use-eliminar-producto'
import { useProductos } from '@/hooks/productos/use-productos'
import { useDebounce } from '@/hooks/use-debounce'
import { useFormik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import FiltrosProductos from './panel-productos/filtros-productos'
import TablaProductos from './panel-productos/tabla-productos'

const productoValidationSchema = Yup.object({
	nombre: Yup.string().trim().required('El nombre es obligatorio'),
	id_linea_negocio: Yup.number()
		.required('La línea de negocio es obligatoria')
		.min(1, 'La línea de negocio es obligatoria'),
	codigo: Yup.string().nullable(),
})

type ProductosClientProps = {
	initialData: ObtenerProductosResponse
}

export default function ProductosClient({ initialData }: ProductosClientProps) {
	const [pagina, setPagina] = useState<number>(1)
	const [inputBusqueda, setInputBusqueda] = useState('')
	const textoBusqueda = useDebounce(inputBusqueda, 300)
	const [filtroLineaNegocio, setFiltroLineaNegocio] = useState<string>('todas')

	const { data: productos } = useProductos(
		initialData,
		filtroLineaNegocio === 'todas' ? null : Number(filtroLineaNegocio),
		textoBusqueda,
		pagina,
		10,
	)
	const { data: lineasNegocio } = useLineasNegocio()
	const crearMutation = useCrearProducto()
	const actualizarMutation = useActualizarProducto()
	const eliminarMutation = useEliminarProducto()

	const [dialogAbierto, setDialogAbierto] = useState(false)
	const [modoEdicion, setModoEdicion] = useState(false)
	const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null)
	const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(
		null,
	)

	const formik = useFormik({
		initialValues: {
			nombre: '',
			id_linea_negocio: 0,
			codigo: '',
		},
		validationSchema: productoValidationSchema,
		enableReinitialize: true,
		onSubmit: async values => {
			if (modoEdicion && productoAEditar) {
				const request: ActualizarProductoRequest = {
					id: productoAEditar.id,
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

	const abrirDialogCrear = () => {
		setModoEdicion(false)
		setProductoAEditar(null)
		formik.resetForm({
			values: { nombre: '', id_linea_negocio: 0, codigo: '' },
		})
		setDialogAbierto(true)
	}

	const abrirDialogEditar = (producto: Producto) => {
		setModoEdicion(true)
		setProductoAEditar(producto)
		formik.resetForm({
			values: {
				nombre: producto.nombre,
				id_linea_negocio: producto.id_linea_negocio,
				codigo: producto.codigo ?? '',
			},
		})
		setDialogAbierto(true)
	}

	const cerrarDialog = () => {
		setDialogAbierto(false)
		setModoEdicion(false)
		setProductoAEditar(null)
		formik.resetForm()
	}

	const nombreLineaNegocio = (id: number) => {
		const ln = lineasNegocio?.find(l => l.id === id)
		return ln?.nombre ?? 'Sin línea'
	}

	return (
		<PanelLayout>
			<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border/80 p-3 sm:p-4'>
					<FiltrosProductos
						busqueda={inputBusqueda}
						onBusquedaChange={setInputBusqueda}
						filtroLineaNegocio={filtroLineaNegocio}
						onFiltroLineaNegocioChange={setFiltroLineaNegocio}
						total={productos?.data.length || 0}
						totalFiltrados={productos?.data.length || 0}
						onCrear={abrirDialogCrear}
					/>
				</div>

				<div className='p-3 sm:p-4'>
					<TablaProductos
						productos={productos?.data || []}
						isFetching={false}
						pagina={pagina}
						totalPaginas={productos?.total_paginas || 0}
						onPaginaChange={setPagina}
						onEditar={abrirDialogEditar}
						onEliminar={setProductoAEliminar}
						nombreLineaNegocio={nombreLineaNegocio}
					/>
				</div>
			</section>

			<Dialog
				open={dialogAbierto}
				onOpenChange={open => !open && cerrarDialog()}
			>
				<DialogContent>
					<DialogTitle>
						{modoEdicion ? 'Editar producto' : 'Nuevo producto'}
					</DialogTitle>
					<DialogDescription>
						{modoEdicion
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
								<p className='text-xs text-destructive'>
									{formik.errors.nombre}
								</p>
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

						<div className='space-y-2'>
							<Label htmlFor='codigo'>Código</Label>
							<Input
								id='codigo'
								name='codigo'
								value={formik.values.codigo}
								onChange={formik.handleChange}
								placeholder='Código del producto (opcional)'
							/>
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
									: modoEdicion
										? 'Guardar cambios'
										: 'Crear producto'}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			<ConfirmDialog
				open={productoAEliminar !== null}
				onOpenChange={() => setProductoAEliminar(null)}
				title='¿Eliminar producto?'
				description={`${productoAEliminar?.nombre ?? ''} será marcado como eliminado y no aparecerá en el listado.`}
				confirmText='Eliminar'
				onConfirm={() => {
					if (productoAEliminar) {
						eliminarMutation.mutate(productoAEliminar.id)
						setProductoAEliminar(null)
					}
				}}
				isPending={eliminarMutation.isPending}
			/>
		</PanelLayout>
	)
}
