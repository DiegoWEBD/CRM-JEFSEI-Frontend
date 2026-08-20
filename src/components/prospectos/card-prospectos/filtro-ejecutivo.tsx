'use client'

import AuthGuard from '@/components/layouts/guards/auth-guard'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { useUsuarios } from '@/hooks/usuarios/use-usuarios'
import { useMemo } from 'react'

const ROLES_GUARD = ['GERENTE_GENERAL', 'GERENTE_COMERCIAL', 'GERENTE_OPERACIONES']

const ROLES_FILTRO = [
	'EJECUTIVO_COMERCIAL',
	'EJECUTIVO_EVALUACION_PROYECTOS',
	'GERENTE_GENERAL',
	'GERENTE_COMERCIAL',
	'GERENTE_OPERACIONES',
]

type FiltroEjecutivoProps = {
	value: string
	onChange: (value: string) => void
}

export default function FiltroEjecutivo({ value, onChange }: FiltroEjecutivoProps) {
	const { data: usuarios, isLoading } = useUsuarios()

	const ejecutivos = useMemo(() => {
		if (!usuarios) return []
		return usuarios
			.filter(u => u.roles.some(r => ROLES_FILTRO.includes(r.codigo)))
			.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
	}, [usuarios])

	return (
		<AuthGuard allowedRoles={ROLES_GUARD} fallback={null}>
			<div className='flex-1 space-y-1.5'>
				<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
					Ejecutivo
				</p>
				<Select value={value || '__all__'} onValueChange={v => onChange(v === '__all__' ? '' : v)}>
					<SelectTrigger className='h-9 w-full text-xs shadow-none'>
						<SelectValue placeholder='Todos los ejecutivos' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='__all__' className='text-xs text-muted-foreground'>
							Todos los ejecutivos
						</SelectItem>
						{isLoading ? (
							<SelectItem value='__loading__' disabled className='text-xs'>
								Cargando...
							</SelectItem>
						) : (
							ejecutivos.map(u => (
								<SelectItem key={u.rut} value={u.rut} className='text-xs'>
									{u.nombre}
								</SelectItem>
							))
						)}
					</SelectContent>
				</Select>
			</div>
		</AuthGuard>
	)
}
