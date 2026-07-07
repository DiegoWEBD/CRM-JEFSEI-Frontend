'use client'

import { CheckIcon, XIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/button'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { formatearFecha } from '@/utils/formatear-fecha'
import CuotaPlanPago from '@/dominio/plan-pago/cuota-plan-pago'
import { useState } from 'react'

type CuotasPlanPagoTableProps = {
	cuotas: CuotaPlanPago[]
	onMarcarPago?: (idCuota: number) => Promise<void>
}

const TH = 'border border-border px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wide'
const TD = 'border border-border px-2 py-1.5 text-center align-middle text-[11px] leading-snug'

export function CuotasPlanPagoTable({ cuotas, onMarcarPago }: CuotasPlanPagoTableProps) {
	const [pagandoId, setPagandoId] = useState<number | null>(null)
	const [confirmarCuotaId, setConfirmarCuotaId] = useState<number | null>(null)

	const handlePagar = (idCuota: number) => {
		if (!onMarcarPago || pagandoId !== null) return
		setConfirmarCuotaId(idCuota)
	}

	const handleConfirmarPago = async () => {
		if (confirmarCuotaId === null) return
		setPagandoId(confirmarCuotaId)
		setConfirmarCuotaId(null)
		try {
			await onMarcarPago!(confirmarCuotaId)
		} finally {
			setPagandoId(null)
		}
	}

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
							<span>Vence: {formatearFecha(new Date(cuota.fecha_vencimiento.slice(0, 10) + 'T12:00:00'), 'd MMM yyyy')}</span>
							<span>
								{cuota.fecha_pago
									? `Pagado: ${formatearFecha(new Date(cuota.fecha_pago), "d MMM yyyy, HH:mm")}`
									: '—'}
							</span>
						</div>
						<div className='flex justify-end'>
							{cuota.pagado ? (
								<span className='text-[10px] text-emerald-600'>Pagado</span>
							) : (
								<Button
									variant='outline'
									size='sm'
									className='h-7 text-[10px]'
									disabled={!onMarcarPago || pagandoId === cuota.id}
									onClick={() => handlePagar(cuota.id)}
								>
									{pagandoId === cuota.id ? (
										<Loader2 className='mr-1 h-3 w-3 animate-spin' />
									) : null}
									Pagar
								</Button>
							)}
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
								{formatearFecha(new Date(cuota.fecha_vencimiento.slice(0, 10) + 'T12:00:00'), 'd MMM yyyy')}
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
								{cuota.fecha_pago ? formatearFecha(new Date(cuota.fecha_pago), "d MMM yyyy, HH:mm") : '—'}
							</td>
							<td className={TD}>
								<div className='flex items-center justify-center'>
									{cuota.pagado ? (
										<span className='text-[10px] text-emerald-600'>Pagado</span>
									) : (
										<Button
											variant='outline'
											size='sm'
											className='h-7 text-[10px]'
											disabled={!onMarcarPago || pagandoId === cuota.id}
											onClick={() => handlePagar(cuota.id)}
										>
											{pagandoId === cuota.id ? (
												<Loader2 className='mr-1 h-3 w-3 animate-spin' />
											) : null}
											Pagar
										</Button>
									)}
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

			<ConfirmDialog
				open={confirmarCuotaId !== null}
				onOpenChange={() => setConfirmarCuotaId(null)}
				title='Marcar cuota como pagada'
				description='¿Estás seguro de marcar esta cuota como pagada? Esta acción es irreversible.'
				confirmText='Sí, pagar'
				onConfirm={handleConfirmarPago}
				variant='destructive'
				isPending={pagandoId !== null}
			/>
		</>)
}
