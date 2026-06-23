'use client'

import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import { useQueryPolizas } from '@/hooks/polizas/use-query-polizas'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import KpiEstadoPoliza from './kpi-estado-poliza/kpi-estado-poliza'
import { CardHeader, CardTitle } from '@/components/card'
import ContenedorPolizas from './contenedor-polizas/contenedor-polizas'
import { useFiltrarPolizas } from '@/hooks/polizas/use-filtrar-polizas'

type CardPolizasProps = {
	idCliente?: number
	nombreCliente: string
}

export default function CardPolizas({
	idCliente,
	nombreCliente,
}: CardPolizasProps) {
	const { data: polizas } = useQueryPolizas(idCliente)
	const [openRegistrarPoliza, setOpenRegistrarPoliza] = useState<boolean>(false)
	const { polizasPorEstado, primaVigente } = useFiltrarPolizas(polizas)

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle className='min-w-0 text-sm font-semibold leading-tight tracking-tight text-foreground'>Pólizas del cliente</CardTitle>
				<Button
					type='button'
					size='sm'
					className='h-8 shrink-0 gap-1 text-xs shadow-none'
					onClick={() => setOpenRegistrarPoliza(true)}
				>
					<Plus className='h-3.5 w-3.5' aria-hidden />
					Registrar póliza
				</Button>
			</CardHeader>

			<CardContent>
				<Card className='border-border shadow-none'>
					<CardContent className='space-y-2.5 p-3'>
						<div className='grid grid-cols-2 gap-1.5 sm:grid-cols-3'>
							<KpiEstadoPoliza
								label='Pólizas vigentes'
								kpi={
									polizasPorEstado.get('VIGENTE')! +
									polizasPorEstado.get('POR_VENCER')!
								}
								className='border-emerald-500/25 bg-emerald-500/6'
							/>
							<KpiEstadoPoliza
								label='Canceladas'
								kpi={polizasPorEstado.get('CANCELADA')!}
							/>

							<KpiEstadoPoliza
								label='Prima vigente'
								kpi={`UF ${primaVigente}`}
								className='border-sky-500/25 bg-sky-500/6'
							/>

							<KpiEstadoPoliza
								label='Total pólizas'
								kpi={polizas?.length || 0}
							/>

							<KpiEstadoPoliza
								label='Por vencer'
								kpi={polizasPorEstado.get('POR_VENCER')!}
								className='border-amber-500/25 bg-amber-500/6'
							/>

							<KpiEstadoPoliza
								label='Vencidas'
								kpi={polizasPorEstado.get('VENCIDA')!}
							/>
						</div>

						<ContenedorPolizas polizas={polizas} />
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	)
}
