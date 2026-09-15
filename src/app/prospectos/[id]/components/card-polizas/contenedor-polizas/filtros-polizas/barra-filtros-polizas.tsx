'use client'

import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import type CompanySeguro from '@/dominio/company-seguro/company-seguro'
import type { FiltrosPolizasState } from '@/hooks/polizas/use-filtros-polizas'
import { Search } from 'lucide-react'

type BarraFiltrosPolizasProps = {
	filtros: FiltrosPolizasState
	companias: CompanySeguro[]
	hayFiltrosActivos: boolean
	onCambiar: <K extends keyof FiltrosPolizasState>(
		key: K,
		value: FiltrosPolizasState[K],
	) => void
	onLimpiar: () => void
}

export default function BarraFiltrosPolizas({
	filtros,
	companias,
	hayFiltrosActivos,
	onCambiar,
	onLimpiar,
}: BarraFiltrosPolizasProps) {
	return (
		<div className='rounded-lg border border-border/80 bg-muted/10 p-2.5'>
			<div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end'>
				<div className='w-full sm:w-auto sm:min-w-34 sm:max-w-40'>
					<Label className='mb-1 block text-xs text-muted-foreground'>
						Compañía
					</Label>
					<Select
						value={filtros.id_company}
						onValueChange={v => onCambiar('id_company', v)}
					>
						<SelectTrigger className='h-8 w-full text-xs shadow-none'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='__todos__' className='text-xs'>
								Todas
							</SelectItem>
							{companias.map(c => (
								<SelectItem key={c.id} value={String(c.id)} className='text-xs'>
									{c.nombre}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className='w-full sm:min-w-40 sm:flex-[1.4] sm:max-w-56'>
					<Label className='mb-1 block text-xs text-muted-foreground'>
						Buscar
					</Label>
					<div className='relative'>
						<Search className='pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground' />
						<Input
							className='h-8 pl-7 text-xs shadow-none'
							placeholder='Nº de póliza'
							value={filtros.texto_busqueda}
							onChange={e => onCambiar('texto_busqueda', e.target.value)}
						/>
					</div>
				</div>

				{hayFiltrosActivos ? (
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-8 shrink-0 px-2 text-xs'
						onClick={onLimpiar}
					>
						Limpiar filtros
					</Button>
				) : null}
			</div>
		</div>
	)
}
