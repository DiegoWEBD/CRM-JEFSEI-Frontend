'use client'

import { Badge } from '@/components/badge'
import Paginacion from '@/components/paginacion/paginacion'
import { Skeleton } from '@/components/skeleton'
import type Poliza from '@/dominio/poliza/poliza'
import { formatUF } from '@/lib/uf'
import { useRouter } from 'next/navigation'

type TablaPolizasProps = {
	polizas: Poliza[]
	isFetching: boolean
	pagina: number
	totalPaginas: number
	onPaginaChange: (pagina: number) => void
}

const ESTADO_BADGE: Record<string, string> = {
	REGISTRADA:
		'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
	VIGENTE:
		'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
	POR_VENCER:
		'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
	VENCIDA: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
	CANCELADA:
		'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
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
			<div className='space-y-3 lg:hidden'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className='rounded-lg border border-border bg-card p-4'>
						<div className='flex items-start justify-between gap-2'>
							<div className='space-y-1.5'>
								<Skeleton className='h-4 w-28' />
								<Skeleton className='h-3 w-32' />
							</div>
							<Skeleton className='h-5 w-16 rounded-full' />
						</div>
						<div className='mt-2 grid grid-cols-2 gap-x-3 gap-y-1'>
							<Skeleton className='h-3 w-20' />
							<Skeleton className='h-3 w-24' />
							<Skeleton className='h-3 w-16' />
							<Skeleton className='h-3 w-20' />
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
			<div className='space-y-3 lg:hidden'>
				{polizas.map(poliza => (
					<button
						key={poliza.numero_poliza}
						type='button'
						onClick={() => router.push(`/polizas/${poliza.numero_poliza}`)}
						className='w-full rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent/40'
					>
						<div className='flex items-start justify-between gap-2'>
							<div className='min-w-0'>
								<p className='text-sm font-medium truncate'>
									{poliza.numero_poliza}
								</p>
								<p className='text-xs text-muted-foreground truncate'>
									{poliza.nombre_cliente}
								</p>
							</div>
							<Badge className={ESTADO_BADGE[poliza.estado] ?? ''}>
								{poliza.estado}
							</Badge>
						</div>
						<div className='mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground'>
							<span>Producto: {poliza.nombre_producto}</span>
							<span>Compañía: {poliza.company?.nombre ?? '—'}</span>
							<span>Prima: {formatUF(poliza.prima_neta)}</span>
							<span>Tipo: {poliza.tipo}</span>
						</div>
					</button>
				))}
			</div>

			{/* Desktop */}
			<div className='hidden lg:block'>
				<div className='overflow-x-auto rounded-lg border border-border'>
					<table className='w-full'>
						<thead>
							<tr className='border-b border-border bg-muted/40'>
								<th className='h-9 px-3 text-left text-sm font-medium uppercase tracking-wide whitespace-nowrap'>
									N° Póliza
								</th>
								<th className='h-9 px-3 text-left text-sm font-medium uppercase tracking-wide whitespace-nowrap'>
									Cliente
								</th>
								<th className='h-9 px-3 text-left text-sm font-medium uppercase tracking-wide whitespace-nowrap'>
									Producto
								</th>
								<th className='h-9 px-3 text-left text-sm font-medium uppercase tracking-wide whitespace-nowrap'>
									Compañía
								</th>

								<th className='h-9 px-3 text-right text-sm font-medium uppercase tracking-wide whitespace-nowrap'>
									Prima Neta
								</th>
								<th className='h-9 px-3 text-center text-sm font-medium uppercase tracking-wide whitespace-nowrap'>
									Estado
								</th>
								<th className='h-9 px-3 text-left text-sm font-medium uppercase tracking-wide whitespace-nowrap'>
									Vigencia
								</th>
							</tr>
						</thead>
						<tbody>
							{polizas.map(poliza => (
								<tr
									key={poliza.numero_poliza}
									className='border-b border-border/50 hover:bg-accent/40 cursor-pointer transition-colors last:border-b-0'
									onClick={() =>
										router.push(`/polizas/${poliza.numero_poliza}`)
									}
								>
									<td className='px-3 py-2.5 text-sm font-medium whitespace-nowrap'>
										{poliza.numero_poliza}
									</td>
									<td className='px-3 py-2.5 text-sm whitespace-nowrap max-w-48 truncate'>
										{poliza.nombre_cliente}
									</td>
									<td className='px-3 py-2.5 text-sm whitespace-nowrap'>
										{poliza.nombre_producto}
									</td>
									<td className='px-3 py-2.5 text-sm whitespace-nowrap'>
										{poliza.company?.nombre ?? '—'}
									</td>

									<td className='px-3 py-2.5 text-sm whitespace-nowrap text-right tabular-nums'>
										{formatUF(poliza.prima_neta)}
									</td>
									<td className='px-3 py-2.5 text-sm whitespace-nowrap text-center'>
										<Badge className={ESTADO_BADGE[poliza.estado] ?? ''}>
											{poliza.estado}
										</Badge>
									</td>
									<td className='px-3 py-2.5 text-sm whitespace-nowrap'>
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
