'use client'

import { Badge } from '@/components/badge'
import { Input } from '@/components/input'
import { Skeleton } from '@/components/skeleton'
import { useRolesConPermisos } from '@/hooks/roles/use-roles-con-permisos'
import { useDebounce } from '@/hooks/use-debounce'
import { Search } from 'lucide-react'
import { useState } from 'react'
import ChecklistPermisos from './checklist-permisos'

export default function PermisosPorRol() {
	const { data: roles, isFetching } = useRolesConPermisos()
	const [codigoRol, setCodigoRol] = useState<string | null>(null)
	const [inputBusqueda, setInputBusqueda] = useState('')
	const textoBusqueda = useDebounce(inputBusqueda, 300)

	const rolSeleccionado =
		roles?.find(rol => rol.codigo === codigoRol) ?? roles?.[0] ?? null

	if (isFetching && !roles) {
		return (
			<div className='grid gap-4 lg:grid-cols-[15rem_1fr]'>
				<div className='space-y-1.5'>
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className='h-10 w-full rounded-md' />
					))}
				</div>
				<div className='space-y-3'>
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className='h-12 w-full rounded-md' />
					))}
				</div>
			</div>
		)
	}

	if (!roles || roles.length === 0) {
		return (
			<div className='flex items-center justify-center py-12'>
				<p className='text-sm text-muted-foreground'>
					No se encontraron roles
				</p>
			</div>
		)
	}

	return (
		<div className='grid gap-4 lg:grid-cols-[15rem_1fr]'>
			<aside className='space-y-1.5'>
				{roles.map(rol => {
					const seleccionado = rolSeleccionado?.codigo === rol.codigo
					return (
						<button
							key={rol.codigo}
							type='button'
							onClick={() => setCodigoRol(rol.codigo)}
							className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-xs transition-colors ${
								seleccionado
									? 'border-primary bg-primary/5 font-semibold text-foreground'
									: 'border-border text-muted-foreground hover:bg-muted/40'
							}`}
						>
							<span className='min-w-0 truncate'>{rol.nombre}</span>
							<Badge variant='pastel-slate'>{rol.permisos.length}</Badge>
						</button>
					)
				})}
			</aside>

			<div className='min-w-0 space-y-3'>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Buscar permiso por código o descripción...'
						value={inputBusqueda}
						onChange={e => setInputBusqueda(e.target.value)}
						className='h-9 pl-9 text-sm shadow-none'
					/>
				</div>

				{rolSeleccionado && (
					<ChecklistPermisos
						key={rolSeleccionado.codigo}
						rol={rolSeleccionado}
						textoBusqueda={textoBusqueda}
					/>
				)}
			</div>
		</div>
	)
}
