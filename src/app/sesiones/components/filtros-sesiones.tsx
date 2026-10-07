'use client'

import { Button } from '@/components/button'
import FiltroUsuario from '@/components/filtro-usuario/filtro-usuario'
import { Input } from '@/components/input'
import { RefreshCw, Search } from 'lucide-react'

type FiltrosSesionesProps = {
	busqueda: string
	onBusquedaChange: (valor: string) => void
	rutUsuario: string
	onRutUsuarioChange: (valor: string) => void
	total: number
	totalPagina: number
	onActualizar: () => void
	actualizando: boolean
}

export default function FiltrosSesiones({
	busqueda,
	onBusquedaChange,
	rutUsuario,
	onRutUsuarioChange,
	total,
	totalPagina,
	onActualizar,
	actualizando,
}: FiltrosSesionesProps) {
	return (
		<>
			<div className='flex flex-wrap items-center gap-2'>
				<div className='relative min-w-0 flex-1'>
					<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Buscar por IP, RUT o nombre...'
						value={busqueda}
						onChange={e => onBusquedaChange(e.target.value)}
						className='pl-9'
					/>
				</div>

				<FiltroUsuario
					value={rutUsuario}
					onChange={onRutUsuarioChange}
				/>

				<Button
					variant='outline'
					size='sm'
					onClick={onActualizar}
					disabled={actualizando}
				>
					<RefreshCw
						className={`mr-1 size-4 ${actualizando ? 'animate-spin' : ''}`}
					/>
					{actualizando ? 'Actualizando...' : 'Actualizar'}
				</Button>
			</div>

			<p className='mt-3 text-xs text-muted-foreground'>
				Mostrando {totalPagina} de {total} sesiones
			</p>
		</>
	)
}