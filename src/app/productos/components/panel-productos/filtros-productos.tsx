'use client'

import { Button } from '@/components/button'
import { Input } from '@/components/input'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { useLineasNegocio } from '@/hooks/lineas-negocio/use-lineas-negocio'
import { Plus, Search } from 'lucide-react'

type FiltrosProductosProps = {
	busqueda: string
	onBusquedaChange: (valor: string) => void
	filtroLineaNegocio: string
	onFiltroLineaNegocioChange: (valor: string) => void
	total: number
	totalFiltrados: number
	onCrear: () => void
}

export default function FiltrosProductos({
	busqueda,
	onBusquedaChange,
	filtroLineaNegocio,
	onFiltroLineaNegocioChange,
	total,
	totalFiltrados,
	onCrear,
}: FiltrosProductosProps) {
	const { data: lineasNegocio = [] } = useLineasNegocio()

	return (
		<>
			<div className='flex flex-wrap items-center gap-2'>
				<div className='relative min-w-0 flex-1'>
					<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Buscar producto...'
						value={busqueda}
						onChange={e => onBusquedaChange(e.target.value)}
						className='pl-9'
					/>
				</div>

				<Select
					value={filtroLineaNegocio}
					onValueChange={onFiltroLineaNegocioChange}
				>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Línea de negocio' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='todas'>Todas las líneas</SelectItem>
						{lineasNegocio.map(ln => (
							<SelectItem key={ln.id} value={ln.id.toString()}>
								{ln.nombre}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<PermissionGuard allowedPermissions={['ADMINISTRAR_PRODUCTOS']}>
					<Button size='sm' onClick={onCrear}>
						<Plus className='mr-1 size-4' />
						Nuevo producto
					</Button>
				</PermissionGuard>
			</div>

			<p className='mt-3 text-xs text-muted-foreground'>
				Mostrando {totalFiltrados} de {total} productos
			</p>
		</>
	)
}
