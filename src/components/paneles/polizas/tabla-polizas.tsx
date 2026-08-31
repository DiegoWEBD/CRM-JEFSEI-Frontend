'use client'

import { Badge } from '@/components/badge'
import Paginacion from '@/components/paginacion/paginacion'
import { Skeleton } from '@/components/skeleton'
import type Poliza from '@/dominio/poliza/poliza'
import {
	ESTADO_POLIZA_PERFIL_BADGE,
	ESTADO_POLIZA_PERFIL_LABELS,
} from '@/lib/estados-cotizaciones'
import { formatUF } from '@/lib/uf'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type TablaPolizasProps = {
	polizas: Poliza[]
	isFetching: boolean
	pagina: number
	totalPaginas: number
	onPaginaChange: (pagina: number) => void
}

function formatFecha(fecha?: string | null): string {
	if (!fecha) return '—'
	return new Date(fecha).toLocaleDateString('es-CL', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
}

function SkeletonTabla() {
	return (
		<>
			<div className='space-y-2 lg:hidden'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className='rounded-lg border border-border/70 bg-card overflow-hidden'
					>
						<div className='flex items-center gap-2 px-3 py-2 bg-muted/30'>
							<Skeleton className='h-2 w-2 rounded-full' />
							<Skeleton className='h-4 w-28' />
							<Skeleton className='h-5 w-16 rounded-full' />
						</div>
						<div className='px-3 py-2 grid grid-cols-3 gap-x-3 gap-y-1.5'>
							<div className='space-y-0.5'>
								<Skeleton className='h-3 w-12' />
								<Skeleton className='h-3 w-16' />
							</div>
							<div className='space-y-0.5'>
								<Skeleton className='h-3 w-14' />
								<Skeleton className='h-3 w-20' />
							</div>
							<div className='space-y-0.5'>
								<Skeleton className='h-3 w-10' />
								<Skeleton className='h-3 w-14' />
							</div>
							<div className='space-y-0.5'>
								<Skeleton className='h-3 w-10' />
								<Skeleton className='h-3 w-14' />
							</div>
							<div className='space-y-0.5'>
								<Skeleton className='h-3 w-14' />
								<Skeleton className='h-3 w-24' />
							</div>
							<div className='space-y-0.5'>
								<Skeleton className='h-3 w-12' />
								<Skeleton className='h-3 w-20' />
							</div>
						</div>
					</div>
				))}
			</div>
			<div className='hidden lg:block'>
				<div className='overflow-x-auto rounded-lg border border-border'>
					<table className='w-full'>
						<thead>
							<tr className='border-b border-border bg-muted/40'>
								{[
									'N° Póliza',
									'Cliente',
									'Producto',
									'Compañía',
									'Prima Neta',
									'Estado',
									'Vigencia',
								].map(h => (
									<th key={h} className='px-4 py-2.5'>
										<Skeleton className='h-3 w-16' />
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: 5 }).map((_, i) => (
								<tr
									key={i}
									className='border-b border-border/50 last:border-b-0'
								>
									{Array.from({ length: 8 }).map((_, j) => (
										<td key={j} className='px-4 py-2.5'>
											<Skeleton className='h-3 w-20' />
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}

export default function TablaPolizas({
	polizas,
	isFetching,
	pagina,
	totalPaginas,
	onPaginaChange,
}: TablaPolizasProps) {
	const router = useRouter()

	if (isFetching && polizas.length === 0) {
		return <SkeletonTabla />
	}

	if (polizas.length === 0) {
		return (
			<div className='rounded-lg border border-border bg-card p-8 text-center'>
				<p className='text-sm text-muted-foreground'>
					No se encontraron pólizas con los filtros seleccionados.
				</p>
			</div>
		)
	}

	return (
		<>
			{/* Mobile */}
			<div className='space-y-2 lg:hidden'>
				{polizas.map(poliza => {
					const estadoColor =
						poliza.estado === 'VIGENTE'
							? 'bg-emerald-500'
							: poliza.estado === 'POR_VENCER'
								? 'bg-amber-500'
								: poliza.estado === 'VENCIDA'
									? 'bg-red-500'
									: poliza.estado === 'CANCELADA'
										? 'bg-slate-400'
										: 'bg-blue-500'
					return (
						<Link
							key={poliza.numero_poliza}
							href={`/polizas/${poliza.numero_poliza}`}
							type='button'
							className='cursor-pointer block w-full rounded-lg border border-border/70 bg-card text-left overflow-hidden transition-all hover:border-primary/20 hover:shadow-sm'
						>
							<div className='flex items-center gap-2 px-3 py-2 bg-muted/30'>
								<div
									className={`h-2 w-2 rounded-full shrink-0 ${estadoColor}`}
								/>
								<p className='text-sm font-semibold text-foreground truncate'>
									{poliza.numero_poliza}
								</p>
								<span className='text-xs text-muted-foreground truncate'>
									{poliza.nombre_cliente}
								</span>
								<Badge
									variant={ESTADO_POLIZA_PERFIL_BADGE[poliza.estado]}
									className='ml-auto shrink-0'
								>
									{ESTADO_POLIZA_PERFIL_LABELS[poliza.estado]}
								</Badge>
							</div>
							<div className='border-t border-border/50' />
							<div className='px-3 py-2 grid grid-cols-3 gap-x-3 gap-y-1.5'>
								<div>
									<p className='text-[10px] text-muted-foreground uppercase tracking-wider'>
										Producto
									</p>
									<p className='text-xs font-semibold text-foreground truncate'>
										{poliza.nombre_producto}
									</p>
								</div>
								<div>
									<p className='text-[10px] text-muted-foreground uppercase tracking-wider'>
										Compañía
									</p>
									<p className='text-xs font-semibold text-foreground truncate'>
										{poliza.company?.nombre ?? '—'}
									</p>
								</div>
								<div>
									<p className='text-[10px] text-muted-foreground uppercase tracking-wider'>
										Tipo
									</p>
									<p className='text-xs font-semibold text-foreground truncate'>
										{poliza.tipo}
									</p>
								</div>
								<div>
									<p className='text-[10px] text-muted-foreground uppercase tracking-wider'>
										Prima UF
									</p>
									<p className='text-xs font-semibold tabular-nums text-foreground'>
										{formatUF(poliza.prima_neta)}
									</p>
								</div>
								<div>
									<p className='text-[10px] text-muted-foreground uppercase tracking-wider'>
										Vigencia
									</p>
									<p className='text-xs font-semibold text-foreground whitespace-nowrap'>
										{formatFecha(poliza.inicio_vigencia)} —{' '}
										{formatFecha(poliza.fin_vigencia)}
									</p>
								</div>
								<div>
									<p className='text-[10px] text-muted-foreground uppercase tracking-wider'>
										Emisión
									</p>
									<p className='text-xs font-semibold text-foreground whitespace-nowrap'>
										{formatFecha(poliza.fecha_emision)}
									</p>
								</div>
							</div>
						</Link>
					)
				})}
			</div>

			{/* Desktop */}
			<div className='hidden lg:block'>
				<div className='overflow-x-auto rounded-lg border border-border/70 bg-card'>
					<table className='w-full'>
						<thead>
							<tr className='border-b border-border bg-muted/50'>
								<th className='h-8 px-3 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap text-muted-foreground'>
									N° Póliza
								</th>
								<th className='h-8 px-3 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap text-muted-foreground'>
									Cliente
								</th>
								<th className='h-8 px-3 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap text-muted-foreground'>
									Producto
								</th>
								<th className='h-8 px-3 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap text-muted-foreground'>
									Compañía
								</th>
								<th className='h-8 px-3 text-right text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap text-muted-foreground'>
									Prima Neta
								</th>
								<th className='h-8 px-3 text-center text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap text-muted-foreground'>
									Estado
								</th>
								<th className='h-8 px-3 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap text-muted-foreground'>
									Vigencia
								</th>
							</tr>
						</thead>
						<tbody>
							{polizas.map(poliza => (
								<tr
									key={poliza.numero_poliza}
									className='border-b border-border/40 hover:bg-accent/30 cursor-pointer transition-colors last:border-b-0'
									onClick={() =>
										router.push(`/polizas/${poliza.numero_poliza}`)
									}
								>
									<td className='px-3 py-2 text-sm font-semibold whitespace-nowrap text-foreground'>
										{poliza.numero_poliza}
									</td>
									<td className='px-3 py-2 text-sm whitespace-nowrap max-w-48 truncate text-foreground'>
										{poliza.nombre_cliente}
									</td>
									<td className='px-3 py-2 text-sm whitespace-nowrap text-foreground'>
										{poliza.nombre_producto}
									</td>
									<td className='px-3 py-2 text-sm whitespace-nowrap text-foreground'>
										{poliza.company?.nombre ?? '—'}
									</td>
									<td className='px-3 py-2 text-sm whitespace-nowrap text-right tabular-nums font-semibold text-foreground'>
										{formatUF(poliza.prima_neta)}
									</td>
									<td className='px-3 py-2 text-sm whitespace-nowrap text-center'>
										<Badge
											variant={ESTADO_POLIZA_PERFIL_BADGE[poliza.estado]}
											className='text-sm'
										>
											{ESTADO_POLIZA_PERFIL_LABELS[poliza.estado]}
										</Badge>
									</td>
									<td className='px-3 py-2 text-sm whitespace-nowrap text-muted-foreground'>
										{formatFecha(poliza.inicio_vigencia)} —{' '}
										{formatFecha(poliza.fin_vigencia)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<Paginacion
				pagina={pagina}
				totalPaginas={totalPaginas}
				onPaginaChange={onPaginaChange}
			/>
		</>
	)
}
