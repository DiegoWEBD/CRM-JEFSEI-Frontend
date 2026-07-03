'use client'

import { CheckIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/checkbox'
import CuotaPlanPago from '@/dominio/plan-pago/cuota-plan-pago'

type CuotasPlanPagoTableProps = {
	cuotas: CuotaPlanPago[]
}

function formatearFecha(fecha: string): string {
	return new Date(fecha).toLocaleDateString('es-CL', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	})
}

function formatearFechaHora(fecha: string): string {
	return new Date(fecha).toLocaleDateString('es-CL', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: 'UTC',
	})
}

const TH = 'border border-border px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wide'
const TD = 'border border-border px-2 py-1.5 text-center align-middle text-[11px] leading-snug'

export function CuotasPlanPagoTable({ cuotas }: CuotasPlanPagoTableProps) {
	return (
		<>
			<div className='divide-y divide-border sm:hidden'>
				{cuotas.map((cuota) => (
					<div key={cuota.numero_cuota} className='space-y-1 px-3 py-2.5 text-xs'>
						<div className='flex items-center justify-between'>
							<span className='text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80'>
								Cuota N°{cuota.numero_cuota}
							</span>
							{cuota.pagado ? (
								<span className='flex items-center gap-1 text-emerald-600'>
									<CheckIcon className='h-3.5 w-3.5' aria-hidden />
									<span className='text-[10px] font-medium'>Pagado</span>
								</span>
							) : (
								<span className='flex items-center gap-1 text-muted-foreground/50'>
									<XIcon className='h-3.5 w-3.5' aria-hidden />
									<span className='text-[10px]'>Pendiente</span>
								</span>
							)}
						</div>
						<div className='flex items-center justify-between text-muted-foreground'>
							<span>Vence: {formatearFecha(cuota.fecha_vencimiento)}</span>
							<span>
								{cuota.fecha_pago
									? `Pagado: ${formatearFechaHora(cuota.fecha_pago)}`
									: '—'}
							</span>
						</div>
						<div className='flex justify-end'>
							<Checkbox
								checked={cuota.pagado}
								disabled
								className='cursor-not-allowed opacity-50'
								aria-label={`Marcar cuota ${cuota.numero_cuota} como pagada`}
							/>
						</div>
					</div>
				))}
				{cuotas.length === 0 && (
					<p className='px-3 py-4 text-center text-xs text-muted-foreground'>
						No hay cuotas registradas
					</p>
				)}
			</div>

			<table className='hidden w-full table-fixed border-collapse border border-border text-foreground sm:table'>
				<colgroup>
					<col className='w-[10%]' />
					<col className='w-[24%]' />
					<col className='w-[14%]' />
					<col className='w-[24%]' />
					<col className='w-[28%]' />
				</colgroup>
				<thead className='sticky top-0 z-10 bg-muted/80 shadow-sm'>
					<tr className='border-b border-border'>
						<th className={TH}>N°</th>
						<th className={TH}>Vence</th>
						<th className={TH}>Pagado</th>
						<th className={TH}>Fecha pago</th>
						<th className={TH}>Acción</th>
					</tr>
				</thead>
				<tbody>
					{cuotas.map((cuota) => (
						<tr
							key={cuota.numero_cuota}
							className='border-b border-border bg-background odd:bg-muted/20'
						>
							<td className={cn(TD, 'tabular-nums font-medium text-foreground')}>
								{cuota.numero_cuota}
							</td>
							<td className={cn(TD, 'whitespace-nowrap text-muted-foreground')}>
								{formatearFecha(cuota.fecha_vencimiento)}
							</td>
							<td className={TD}>
								<div className='flex items-center justify-center'>
									{cuota.pagado ? (
										<CheckIcon className='h-4 w-4 text-emerald-600' aria-hidden />
									) : (
										<XIcon className='h-4 w-4 text-muted-foreground/40' aria-hidden />
									)}
								</div>
							</td>
							<td className={cn(TD, 'whitespace-nowrap tabular-nums text-muted-foreground')}>
								{cuota.fecha_pago ? formatearFechaHora(cuota.fecha_pago) : '—'}
							</td>
							<td className={TD}>
								<div className='flex items-center justify-center'>
									<Checkbox
										checked={cuota.pagado}
										disabled
										className='cursor-not-allowed opacity-50'
										aria-label={`Marcar cuota ${cuota.numero_cuota} como pagada`}
									/>
								</div>
							</td>
						</tr>
					))}
					{cuotas.length === 0 && (
						<tr>
							<td colSpan={5} className='py-4 text-center text-xs text-muted-foreground'>
								No hay cuotas registradas
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</>
	)
}
