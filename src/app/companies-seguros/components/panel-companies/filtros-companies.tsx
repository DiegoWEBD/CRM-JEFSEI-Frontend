'use client'

import { Button } from '@/components/button'
import { Input } from '@/components/input'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { Plus, Search } from 'lucide-react'

type FiltrosCompaniesProps = {
	busqueda: string
	onBusquedaChange: (valor: string) => void
	total: number
	totalFiltrados: number
	onCrear: () => void
}

export default function FiltrosCompanies({
	busqueda,
	onBusquedaChange,
	total,
	totalFiltrados,
	onCrear,
}: FiltrosCompaniesProps) {
	return (
		<>
			<div className='flex flex-wrap items-center gap-2'>
				<div className='relative min-w-0 flex-1'>
					<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Buscar compañía...'
						value={busqueda}
						onChange={e => onBusquedaChange(e.target.value)}
						className='pl-9'
					/>
				</div>

				<PermissionGuard allowedPermissions={['ADMINISTRAR_COMPANIES']}>
					<Button type='button' onClick={onCrear}>
						<Plus className='size-4' />
						Nueva compañía
					</Button>
				</PermissionGuard>
			</div>

			<p className='mt-3 text-xs text-muted-foreground'>
				{totalFiltrados === total
					? `${total} ${total === 1 ? 'compañía' : 'compañías'}`
					: `${totalFiltrados} de ${total} compañías`}
			</p>
		</>
	)
}
