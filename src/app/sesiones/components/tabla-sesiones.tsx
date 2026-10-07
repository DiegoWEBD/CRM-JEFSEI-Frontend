'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import Paginacion from '@/components/paginacion/paginacion'
import { Skeleton } from '@/components/skeleton'
import Sesion from '@/dominio/sesion/sesion'
import { formatearFecha } from '@/utils/formatear-fecha'
import { ShieldBan } from 'lucide-react'

type TablaSesionesProps = {
	sesiones: Sesion[]
	isFetching: boolean
	pagina: number
	totalPaginas: number
	onPaginaChange: (pagina: number) => void
	onRevocar: (sesion: Sesion) => void
}

const formatearFechaSesion = (fecha: string) =>
	formatearFecha(new Date(fecha), 'dd/MM/yyyy HH:mm')

const formatearDuracion = (minutos: number | null): string => {
	if (minutos === null) return '-'
	if (minutos < 1) return '< 1 min'
	if (minutos < 60) return `${Math.round(minutos)} min`
	const horas = Math.floor(minutos / 60)
	const mins = Math.round(minutos % 60)
	return mins > 0 ? `${horas}h ${mins}m` : `${horas}h`
}

function BadgeEstado({ sesion }: { sesion: Sesion }) {
	if (sesion.esta_activa) {
		return <Badge variant='success'>Activa</Badge>
	}
	if (sesion.motivo_revocacion === 'logout' || sesion.motivo_revocacion === 'logout_all') {
		return <Badge variant='outline'>Cerrada</Badge>
	}
	return <Badge variant='destructive'>Revocada</Badge>
}

function SkeletonTabla() {
	return (
		<div className='space-y-2'>
			{Array.from({ length: 6 }).map((_, i) => (
				<Skeleton key={i} className='h-10 w-full rounded-md' />
			))}
		</div>
	)
}

export default function TablaSesiones({
	sesiones,
	isFetching,
	pagina,
	totalPaginas,
	onPaginaChange,
	onRevocar,
}: TablaSesionesProps) {
	if (isFetching && sesiones.length === 0) {
		return <SkeletonTabla />
	}

	if (sesiones.length === 0) {
		return (
			<div className='flex items-center justify-center py-12'>
				<p className='text-sm text-muted-foreground'>
					No se encontraron sesiones
				</p>
			</div>
		)
	}

	return (
		<>
			{/* Mobile: cards */}
			<div className='space-y-3 lg:hidden'>
				{sesiones.map(sesion => (
					<Card
						key={sesion.id}
						className='border-border bg-card shadow-none'
					>
						<CardContent className='p-4'>
							<div className='flex items-start justify-between gap-2'>
								<div className='min-w-0 flex-1 space-y-1'>
									<p className='truncate text-sm font-semibold text-foreground'>
										{sesion.nombre_usuario ?? sesion.rut_usuario}
									</p>
									{sesion.nombre_usuario && (
										<p className='text-xs text-muted-foreground'>
											{sesion.rut_usuario}
										</p>
									)}
									<p className='text-xs text-muted-foreground'>
										{sesion.dispositivo ?? 'Dispositivo desconocido'}
									</p>
									<p className='text-xs text-muted-foreground'>
										IP: {sesion.ip ?? '-'}
									</p>
									<p className='text-xs text-muted-foreground'>
										Inicio: {formatearFechaSesion(sesion.creado_en)}
									</p>
									<p className='text-xs text-muted-foreground'>
										Duración: {formatearDuracion(sesion.duracion_minutos)}
									</p>
								</div>
								<div className='flex flex-col items-end gap-2'>
									<BadgeEstado sesion={sesion} />
									{sesion.esta_activa && (
										<Button
											variant='outline'
											size='sm'
											className='text-xs'
											onClick={() => onRevocar(sesion)}
										>
											<ShieldBan className='mr-1 size-3' />
											Revocar
										</Button>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
				<Paginacion
					pagina={pagina}
					totalPaginas={totalPaginas}
					onPaginaChange={onPaginaChange}
				/>
			</div>

			{/* Desktop: tabla */}
			<div className='hidden lg:block'>
				<div
					className={`overflow-x-auto rounded-lg border border-border ${
						isFetching ? 'opacity-60' : ''
					}`}
				>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-border bg-muted/40'>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Usuario
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Dispositivo
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									IP origen
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Inicio de sesión
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Duración
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Estado
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Acciones
								</th>
							</tr>
						</thead>
						<tbody>
							{sesiones.map(sesion => (
								<tr
									key={sesion.id}
									className='border-b border-border/50 transition-colors hover:bg-accent/50 last:border-b-0'
								>
									<td className='px-4 py-2.5'>
										<p className='max-w-40 truncate text-xs font-medium text-foreground'>
											{sesion.nombre_usuario ?? '-'}
										</p>
										<p className='text-xs text-muted-foreground'>
											{sesion.rut_usuario}
										</p>
									</td>
									<td className='max-w-48 truncate px-4 py-2.5 text-xs text-foreground'>
										{sesion.dispositivo ?? '-'}
									</td>
									<td className='whitespace-nowrap px-4 py-2.5 text-xs text-foreground'>
										{sesion.ip ?? '-'}
									</td>
									<td className='whitespace-nowrap px-4 py-2.5 text-xs text-foreground'>
										{formatearFechaSesion(sesion.creado_en)}
									</td>
									<td className='whitespace-nowrap px-4 py-2.5 text-xs text-foreground'>
										{formatearDuracion(sesion.duracion_minutos)}
									</td>
									<td className='px-4 py-2.5'>
										<BadgeEstado sesion={sesion} />
									</td>
									<td className='px-4 py-2.5'>
										{sesion.esta_activa && (
											<Button
												variant='outline'
												size='sm'
												className='text-xs'
												onClick={() => onRevocar(sesion)}
											>
												<ShieldBan className='mr-1 size-3' />
												Revocar
											</Button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<Paginacion
					pagina={pagina}
					totalPaginas={totalPaginas}
					onPaginaChange={onPaginaChange}
				/>
			</div>
		</>
	)
}