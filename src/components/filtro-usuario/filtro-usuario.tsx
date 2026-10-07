'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { useUsuarios } from '@/hooks/usuarios/use-usuarios'
import { useMemo } from 'react'

type FiltroUsuarioProps = {
	withLabel?: boolean
	value: string
	onChange: (value: string) => void
	/** Si se pasa, solo muestra usuarios con alguno de estos roles. Si no, muestra todos. */
	filtroRoles?: string[]
}

export default function FiltroUsuario({
	withLabel = false,
	value,
	onChange,
	filtroRoles,
}: FiltroUsuarioProps) {
	const { data: usuariosData, isLoading } = useUsuarios({
		pagina: 1,
		tamano_pagina: 100,
	})
	const usuarios = usuariosData?.data

	const usuariosFiltrados = useMemo(() => {
		if (!usuarios) return []
		const lista = filtroRoles
			? usuarios.filter(u => u.roles.some(r => filtroRoles.includes(r.codigo)))
			: usuarios
		return lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
	}, [usuarios, filtroRoles])

	return (
		<div className='flex-1 space-y-1.5'>
			{withLabel && (
				<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
					Usuario
				</p>
			)}
			<Select
				value={value || '__all__'}
				onValueChange={v => onChange(v === '__all__' ? '' : v)}
			>
				<SelectTrigger className='h-9 w-full text-xs shadow-none'>
					<SelectValue placeholder='Todos los usuarios' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='__all__' className='text-xs text-muted-foreground'>
						Todos los usuarios
					</SelectItem>
					{isLoading ? (
						<SelectItem value='__loading__' disabled className='text-xs'>
							Cargando...
						</SelectItem>
					) : (
						usuariosFiltrados.map(u => (
							<SelectItem key={u.rut} value={u.rut} className='text-xs'>
								{u.nombre}
							</SelectItem>
						))
					)}
				</SelectContent>
			</Select>
		</div>
	)
}
