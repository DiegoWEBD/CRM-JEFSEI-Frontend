import { type LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { cn } from '@/lib/utils'

type HomeSeccionProps = {
	icono?: LucideIcon
	titulo: string
	contador?: number | string
	accion?: ReactNode
	children: ReactNode
	className?: string
}

export default function HomeSeccion({
	icono: Icono,
	titulo,
	contador,
	accion,
	children,
	className,
}: HomeSeccionProps) {
	return (
		<Card className={cn('border-border bg-card shadow-none', className)}>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex items-center gap-2'>
					{Icono && (
						<Icono
							className='size-4 shrink-0 text-muted-foreground'
							aria-hidden
						/>
					)}
					<CardTitle primary>{titulo}</CardTitle>
					{contador !== undefined && (
						<span className='rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground'>
							{contador}
						</span>
					)}
				</div>
				{accion}
			</CardHeader>
			<CardContent className='p-3 sm:p-4'>{children}</CardContent>
		</Card>
	)
}
