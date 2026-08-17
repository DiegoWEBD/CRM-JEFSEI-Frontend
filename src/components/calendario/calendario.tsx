import { classname } from '@/lib/class-name'

export default function Calendario({
	dias,
	diaSeleccionado,
	onSeleccionarDia,
}: {
	dias: {
		iso: string
		dia: number
		esMesActual: boolean
		esHoy: boolean
		tieneRecordatorio: boolean
	}[]
	diaSeleccionado: string
	onSeleccionarDia: (iso: string) => void
}) {
	return (
		<div className='rounded-md border border-border/80 p-2'>
			<div className='mb-1 grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase text-muted-foreground'>
				{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, idx) => (
					<span key={`${d}-${idx}`}>{d}</span>
				))}
			</div>
			<div className='grid grid-cols-7 gap-1'>
				{dias.map(d => (
					<button
						key={d.iso}
						type='button'
						className={classname(
							'relative flex h-8 items-center justify-center rounded-md text-sm tabular-nums transition-colors hover:bg-muted',
							!d.esMesActual && 'text-muted-foreground/45',
							d.esHoy && 'border border-primary/50 font-semibold text-primary',
							diaSeleccionado === d.iso &&
								'bg-primary text-primary-foreground hover:bg-primary',
						)}
						onClick={() => onSeleccionarDia(d.iso)}
					>
						{d.dia}
						{d.tieneRecordatorio ? (
							<span
								className={classname(
									'absolute bottom-1 h-1 w-1 rounded-full bg-primary',
									diaSeleccionado === d.iso && 'bg-primary-foreground',
								)}
							/>
						) : null}
					</button>
				))}
			</div>
		</div>
	)
}
