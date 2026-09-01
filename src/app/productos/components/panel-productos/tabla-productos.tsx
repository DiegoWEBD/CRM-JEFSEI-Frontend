'use client'

import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import Producto from '@/dominio/producto/producto'
import { Pencil, Trash2 } from 'lucide-react'
import { SkeletonTablaProductos } from './skeleton-tabla-productos'
import Paginacion from '@/components/paginacion/paginacion'
import { Badge } from '@/components/badge'

type TablaProductosProps = {
	productos: Producto[]
	isFetching: boolean
	pagina: number
	totalPaginas: number
	onPaginaChange: (pagina: number) => void
	onEditar: (producto: Producto) => void
	onEliminar: (producto: Producto) => void
	nombreLineaNegocio: (id: number) => string
}

export default function TablaProductos({
	productos,
	isFetching,
	pagina,
	totalPaginas,
	onPaginaChange,
	onEditar,
	onEliminar,
	nombreLineaNegocio,
}: TablaProductosProps) {
	if (isFetching) {
		return <SkeletonTablaProductos />
	}

	if (productos.length === 0) {
		return (
			<div className='flex items-center justify-center py-12'>
				<p className='text-sm text-muted-foreground'>
					No se encontraron productos
				</p>
			</div>
		)
	}

	return (
		<>
			{/* Mobile: cards */}
			<div className='space-y-3 lg:hidden'>
				<Paginacion
					pagina={pagina}
					totalPaginas={totalPaginas}
					onPaginaChange={onPaginaChange}
				/>

				{productos.map(producto => (
					<Card key={producto.id} className='border-border bg-card shadow-none'>
						<CardContent className='p-4'>
							<div className='flex items-start justify-between gap-2'>
								<div className='min-w-0 flex-1'>
									<p className='truncate text-sm font-semibold text-foreground'>
										{producto.nombre}
									</p>
									<Badge variant='pastel-violet'>
										{nombreLineaNegocio(producto.id_linea_negocio)}
									</Badge>
								</div>
								<div className='flex shrink-0 gap-1'>
									<PermissionGuard
										allowedPermissions={['ADMINISTRAR_PRODUCTOS']}
									>
										<Button
											variant='ghost'
											size='icon'
											className='size-8'
											onClick={() => onEditar(producto)}
										>
											<Pencil className='size-4' />
										</Button>
									</PermissionGuard>
									<PermissionGuard
										allowedPermissions={['ADMINISTRAR_PRODUCTOS']}
									>
										<Button
											variant='ghost'
											size='icon'
											className='size-8 text-destructive hover:text-destructive'
											onClick={() => onEliminar(producto)}
										>
											<Trash2 className='size-4' />
										</Button>
									</PermissionGuard>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Desktop: tabla densa */}
			<div className='hidden lg:block'>
				<Paginacion
					pagina={pagina}
					totalPaginas={totalPaginas}
					onPaginaChange={onPaginaChange}
				/>

				<div className='overflow-x-auto rounded-lg border border-border'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-border bg-muted/40'>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Nombre
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Línea de negocio
								</th>
								<th className='px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Acciones
								</th>
							</tr>
						</thead>
						<tbody>
							{productos.map(producto => (
								<tr
									key={producto.id}
									className='border-b border-border/50 transition-colors hover:bg-accent/50 last:border-b-0'
								>
									<td className='px-4 py-2.5'>
										<p className='font-semibold text-foreground truncate max-w-50'>
											{producto.nombre}
										</p>
									</td>
									<td className='px-4 py-2.5 text-xs text-foreground truncate max-w-35'>
										<Badge variant='pastel-violet'>
											{nombreLineaNegocio(producto.id_linea_negocio)}
										</Badge>
									</td>
									<td className='px-4 py-2.5'>
										<div className='flex items-center justify-end gap-1'>
											<PermissionGuard
												allowedPermissions={['ADMINISTRAR_PRODUCTOS']}
											>
												<Button
													variant='ghost'
													size='icon'
													className='size-8'
													onClick={() => onEditar(producto)}
												>
													<Pencil className='size-4' />
												</Button>
											</PermissionGuard>
											<PermissionGuard
												allowedPermissions={['ADMINISTRAR_PRODUCTOS']}
											>
												<Button
													variant='ghost'
													size='icon'
													className='size-8 text-destructive hover:text-destructive'
													onClick={() => onEliminar(producto)}
												>
													<Trash2 className='size-4' />
												</Button>
											</PermissionGuard>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}
