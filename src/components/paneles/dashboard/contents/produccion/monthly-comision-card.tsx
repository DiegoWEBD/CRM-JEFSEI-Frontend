import { Card, CardContent } from '@/components/card'

type MonthlyComisionCardProps = {
	totalComision: number
	mesLabel: string
}

export default function MonthlyComisionCard({
	totalComision,
	mesLabel,
}: MonthlyComisionCardProps) {
	return (
		<Card className='border-border bg-card shadow-none'>
			<CardContent className='p-3.5'>
				<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
					Comisión mensual
				</p>
				<p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
					{totalComision.toLocaleString('es-CL')} UF
				</p>
				<p className='mt-0.5 text-xs text-muted-foreground'>{mesLabel}</p>
			</CardContent>
		</Card>
	)
}
