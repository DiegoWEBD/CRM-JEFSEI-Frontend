'use client'

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/sheet'
import {
	ColumnaCobranza,
	CuotaDashboard,
	PolizaSinPlanPago,
} from '@/dominio/cobranza/dashboard-cobranza'
import ItemCobranza from './item-cobranza'

type DialogDetalleKpiProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	columna: ColumnaCobranza | null
	items: (CuotaDashboard | PolizaSinPlanPago)[]
}

const LABELS: Record<ColumnaCobranza, string> = {
	pagados: 'Pagados',
	morosos: 'Morosos (+30 días)',
	atrasados: 'Atrasados (≤30 días)',
	sinPlanPago: 'Sin plan de pago',
	llamarHoy: 'Llamar hoy',
	proximos10: 'Contactar próximos 10 días',
}

export default function DialogDetalleKpi({
	open,
	onOpenChange,
	columna,
	items,
}: DialogDetalleKpiProps) {
	const titulo = columna ? LABELS[columna] : ''

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='flex w-full flex-col gap-0 p-0 sm:max-w-xl'>
				<SheetHeader className='border-b border-border px-4 py-3 text-left'>
					<SheetTitle className='text-base leading-snug'>{titulo}</SheetTitle>
				</SheetHeader>
				<div className='flex-1 space-y-2 overflow-y-auto p-4'>
					{items.length === 0 ? (
						<p className='py-12 text-center text-xs text-muted-foreground'>
							No hay elementos en esta categoría.
						</p>
					) : (
						items.map((item, idx) => (
							<ItemCobranza
								key={
									'numero_cuota' in item
										? item.id
										: item.numero_poliza + '_' + idx
								}
								item={item}
							/>
						))
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}
