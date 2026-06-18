import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { DatosKpi } from '@/hooks/kpi/dto/datos-kpi'
import { Bell } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

type CardKpiProps = {
	datos: DatosKpi
	setKpiAbierto: Dispatch<SetStateAction<string | null>>
}

export default function CardKpi({ datos, setKpiAbierto }: CardKpiProps) {
	const Icon = datos.icon
	return (
		<Card
			key={datos.key}
			role='button'
			tabIndex={0}
			className='cursor-pointer border-border bg-card shadow-none transition-colors hover:border-primary/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
			onClick={() => setKpiAbierto(datos.key)}
			onKeyDown={e => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					setKpiAbierto(datos.key)
				}
			}}
		>
			<CardHeader className='flex flex-row items-start justify-between gap-1 space-y-0 pb-1 pt-3'>
				<CardTitle className='line-clamp-3 min-h-10 text-[10px] font-medium leading-snug text-muted-foreground sm:text-[11px]'>
					{datos.label}
				</CardTitle>
				<Icon className='h-4 w-4 shrink-0 text-muted-foreground' aria-hidden />
			</CardHeader>
			<CardContent className='space-y-1.5 pb-3 pt-0'>
				<p className='text-2xl font-semibold tabular-nums text-foreground'>
					{datos.value}
				</p>
				{datos.infoAdicional != null && datos.infoAdicional > 0 ? (
					<div className='flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/8 px-2 py-1.5 text-[10px] text-amber-950 dark:text-amber-50'>
						<Bell
							className='h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400'
							aria-hidden
						/>
						<span>
							<span className='font-semibold tabular-nums'>
								{datos.infoAdicional}
							</span>{' '}
							nuevo
							{datos.infoAdicional !== 1 ? 's' : ''} por revisar
						</span>
					</div>
				) : null}
			</CardContent>
		</Card>
	)
}
