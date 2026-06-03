import { useComunicadosGerencia } from '@/hooks/comunicados-gerencia/use-comunicados-gerencia'
import { Bell } from 'lucide-react'
import { Badge } from '../badge/badge'
import Card from '../card/card'
import CardContent from '../card/card-content/card-content'
import CardHeader from '../card/card-header/card-header'
import CardTitle from '../card/card-title/card-title'
import { formatearFecha } from '@/utils/formatear-fecha'

export default function CardComunicadoGerencia() {
	const { data: comunicados } = useComunicadosGerencia()

	return (
		<Card className='border-border bg-card'>
			<CardHeader className='flex flex-row items-center justify-between border-b border-border pb-2 pt-3'>
				<CardTitle primary>Avisos de gerencia</CardTitle>
				<Bell className='h-4 w-4 text-muted-foreground' aria-hidden />
			</CardHeader>
			<CardContent className='space-y-2 p-3 sm:p-4'>
				{comunicados?.length === 0 && (
					<p className='py-3 text-center text-xs text-muted-foreground'>
						Sin avisos relevantes por ahora.
					</p>
				)}
				<div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
					{comunicados?.map(aviso => (
						<div
							key={aviso.id}
							className='rounded-md border border-border/80 px-3 py-2 text-xs'
						>
							<div className='flex items-start justify-between gap-2'>
								<p className='font-medium text-foreground'>{aviso.titulo}</p>
								<Badge variant='outline' className='h-5 shrink-0 text-[9px]'>
									{aviso.prioridad}
								</Badge>
							</div>
							<p className='mt-1 leading-snug text-muted-foreground'>
								{aviso.descripcion}
							</p>
							<p className='mt-1 text-[10px] tabular-nums text-muted-foreground'>
								{formatearFecha(new Date(aviso.fecha), 'dd/MM/yyyy')}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
