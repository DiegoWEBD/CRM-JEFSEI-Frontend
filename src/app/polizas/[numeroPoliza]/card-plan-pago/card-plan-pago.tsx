'use client'

import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { CuotasPlanPagoTable } from '@/components/cuotas-plan-pago-table/cuotas-plan-pago-table'
import { Skeleton } from '@/components/skeleton'
import { useObtenerPlanPago } from '@/hooks/polizas/use-obtener-plan-pago'
import DialogCrearPlanPago from '@/app/polizas/[numeroPoliza]/dialog-crear-plan-pago/dialog-crear-plan-pago'
import { Plus } from 'lucide-react'
import { useState } from 'react'

type CardPlanPagoProps = {
	numeroPoliza: string
}

export default function CardPlanPago({ numeroPoliza }: CardPlanPagoProps) {
	const [openDialog, setOpenDialog] = useState(false)
	const { data: planPago, isLoading: planPagoCargando } =
		useObtenerPlanPago(numeroPoliza)

	return (
		<>
			<Card className='border-border shadow-none'>
				<CardHeader className='border-b border-border pb-2 pt-3'>
					<CardTitle className='text-sm font-semibold'>Plan de pago</CardTitle>
				</CardHeader>
				<CardContent className='max-h-[min(52vh,380px)] overflow-auto p-0'>
					{planPagoCargando ? (
						<Skeleton className='h-40 w-full rounded-none' />
					) : planPago ? (
						<CuotasPlanPagoTable cuotas={planPago.cuotas} />
					) : (
						<div className='flex flex-col items-center justify-center gap-3 px-4 py-6'>
							<p className='text-sm text-muted-foreground'>
								No hay plan de pago registrado
							</p>
							<Button
								variant='outline'
								size='sm'
								onClick={() => setOpenDialog(true)}
							>
								<Plus className='mr-1.5 h-3.5 w-3.5' />
								Crear plan de pago
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
			<DialogCrearPlanPago
				open={openDialog}
				onOpenChange={setOpenDialog}
				numeroPoliza={numeroPoliza}
			/>
		</>
	)
}
