'use client'

import { Input } from '@/components/input'
import { Search } from 'lucide-react'

type FiltrosEstadosProps = {
	busqueda: string
	onBusquedaChange: (valor: string) => void
	total: number
	totalFiltrados: number
}

export default function FiltrosEstados({
	busqueda,
	onBusquedaChange,
	total,
	totalFiltrados,
}: FiltrosEstadosProps) {
	return (
		<>
			<div className='flex flex-wrap items-center gap-2'>
				<div className='relative min-w-0 flex-1'>
					<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Buscar estado o etapa...'
						value={busqueda}
						onChange={e => onBusquedaChange(e.target.value)}
						className='pl-9'
					/>
				</div>
			</div>

			<p className='mt-3 text-xs text-muted-foreground'>
				{totalFiltrados === total
					? `${total} ${total === 1 ? 'estado' : 'estados'}`
					: `${totalFiltrados} de ${total} estados`}
			</p>
		</>
	)
}
