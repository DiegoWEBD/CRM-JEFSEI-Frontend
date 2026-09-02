'use client'

import { ObtenerProductosResponse } from '@/aplicacion/producto/dtos/obtener-productos-response'
import { ConfirmDialog } from '@/components/confirm-dialog'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import Producto from '@/dominio/producto/producto'
import { useLineasNegocio } from '@/hooks/lineas-negocio/use-lineas-negocio'
import { useEliminarProducto } from '@/hooks/productos/use-eliminar-producto'
import { useProductos } from '@/hooks/productos/use-productos'
import { useDebounce } from '@/hooks/use-debounce'
import { useState } from 'react'

import DialogRegistrarProducto from './dialog-registrar-producto/dialog-registrar-producto'
import FiltrosProductos from './panel-productos/filtros-productos'
import TablaProductos from './panel-productos/tabla-productos'

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

	const eliminarMutation = useEliminarProducto()

	const [dialogAbierto, setDialogAbierto] = useState(false)
	const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null)
	const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(
		null,
	)

	const abrirDialogCrear = () => {
		setProductoAEditar(null)
		setDialogAbierto(true)
	}

	const abrirDialogEditar = (producto: Producto) => {
		setProductoAEditar(producto)
		setDialogAbierto(true)
	}

	const cerrarDialog = () => {
		setDialogAbierto(false)
		setProductoAEditar(null)
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

			<DialogRegistrarProducto
				productoEdicion={productoAEditar || undefined}
				dialogAbierto={dialogAbierto}
				cerrarDialog={cerrarDialog}
				lineasNegocio={lineasNegocio}
			/>

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
