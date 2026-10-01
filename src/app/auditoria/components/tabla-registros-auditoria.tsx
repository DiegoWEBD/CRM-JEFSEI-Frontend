'use client'

import { Badge } from '@/components/badge'
import { Card, CardContent } from '@/components/card'
import Paginacion from '@/components/paginacion/paginacion'
import { Skeleton } from '@/components/skeleton'
import RegistroAuditoria from '@/dominio/registro-auditoria/registro-auditoria'
import { formatearFecha } from '@/utils/formatear-fecha'
import { etiquetaEvento } from '../lib/etiquetas-auditoria'

type TablaRegistrosAuditoriaProps = {
	registros: RegistroAuditoria[]
	isFetching: boolean
	pagina: number
	totalPaginas: number
	onPaginaChange: (pagina: number) => void
	onVerDetalle: (registro: RegistroAuditoria) => void
}

const formatearFechaRegistro = (fecha: string) =>
	formatearFecha(new Date(fecha), 'dd/MM/yyyy HH:mm:ss')

function BadgeResultado({ resultado }: { resultado: string }) {
	return (
		<Badge variant={resultado === 'EXITO' ? 'success' : 'destructive'}>
			{resultado === 'EXITO' ? 'Éxito' : 'Fallido'}
		</Badge>
	)
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

export default function TablaRegistrosAuditoria({
	registros,
	isFetching,
	pagina,
	totalPaginas,
	onPaginaChange,
	onVerDetalle,
}: TablaRegistrosAuditoriaProps) {
	if (isFetching && registros.length === 0) {
		return <SkeletonTabla />
	}

	if (registros.length === 0) {
		return (
			<div className='flex items-center justify-center py-12'>
				<p className='text-sm text-muted-foreground'>
					No se encontraron registros de auditoría
				</p>
			</div>
		)
	}

	return (
		<>
			{/* Mobile: cards */}
			<div className='space-y-3 lg:hidden'>
				{registros.map(registro => (
					<Card
						key={registro.id}
						className='cursor-pointer border-border bg-card shadow-none'
						onClick={() => onVerDetalle(registro)}
					>
						<CardContent className='p-4'>
							<div className='flex items-start justify-between gap-2'>
								<div className='min-w-0 flex-1 space-y-1'>
									<p className='truncate text-sm font-semibold text-foreground'>
										{etiquetaEvento(registro.evento)}
									</p>
									<p className='text-xs text-muted-foreground'>
										{formatearFechaRegistro(registro.fecha_registro)}
									</p>
									<p className='truncate text-xs text-muted-foreground'>
										{registro.nombre_usuario ??
											registro.rut_usuario ??
											'Sin usuario'}
									</p>
									{registro.categoria === 'ACCION_NEGOCIO' && (
										<p className='truncate text-xs text-foreground'>
											{registro.detalle ?? '-'}
										</p>
									)}
								</div>
								<BadgeResultado resultado={registro.resultado} />
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

			{/* Desktop: tabla única acotada (los detalles técnicos van al dialog) */}
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
									Fecha
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Evento
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Usuario
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Acción
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Resultado
								</th>
								<th className='px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									IP origen
								</th>
							</tr>
						</thead>
						<tbody>
							{registros.map(registro => {
								const esAccionNegocio = registro.categoria === 'ACCION_NEGOCIO'

								return (
									<tr
										key={registro.id}
										onClick={() => onVerDetalle(registro)}
										className='cursor-pointer border-b border-border/50 transition-colors hover:bg-accent/50 last:border-b-0'
									>
										<td className='whitespace-nowrap px-4 py-2.5 text-xs text-foreground'>
											{formatearFechaRegistro(registro.fecha_registro)}
										</td>
										<td className='px-4 py-2.5'>
											<Badge variant='pastel-blue'>
												{etiquetaEvento(registro.evento)}
											</Badge>
										</td>
										<td className='px-4 py-2.5'>
											<p className='max-w-40 truncate text-xs font-medium text-foreground'>
												{registro.nombre_usuario ?? '-'}
											</p>
											<p className='text-xs text-muted-foreground'>
												{registro.rut_usuario ?? ''}
											</p>
										</td>
										<td className='px-4 py-2.5'>
											<p
												className='max-w-125  wrap-break-words text-xs text-foreground'
												title={
													esAccionNegocio
														? (registro.detalle ?? undefined)
														: undefined
												}
											>
												{esAccionNegocio ? (registro.detalle ?? '-') : '-'}
											</p>
										</td>
										<td className='px-4 py-2.5'>
											<BadgeResultado resultado={registro.resultado} />
										</td>
										<td className='whitespace-nowrap px-4 py-2.5 text-xs text-foreground'>
											{registro.ip_origen ?? '-'}
										</td>
									</tr>
								)
							})}
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
