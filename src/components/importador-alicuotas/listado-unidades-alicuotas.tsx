'use client'

import { Skeleton } from '@/components/skeleton'
import { useUnidadesAlicuotas } from '@/hooks/importacion-alicuotas/use-unidades-alicuotas'

type ListadoUnidadesAlicuotasProps = {
	idSolicitud: number
}

export default function ListadoUnidadesAlicuotas({
	idSolicitud,
}: ListadoUnidadesAlicuotasProps) {
	const { data, isLoading } = useUnidadesAlicuotas(idSolicitud)

	if (isLoading) {
		return <Skeleton className='h-16 w-full' />
	}

	if (!data || data.unidades.length === 0) {
		return (
			<p className='text-xs text-muted-foreground'>
				No hay unidades importadas para esta solicitud.
			</p>
		)
	}

	return (
		<div className='space-y-1'>
			<p className='text-xs text-muted-foreground'>
				{data.cantidad} unidades importadas
			</p>
			<div className='max-h-40 space-y-0.5 overflow-auto rounded-md border border-border/70 p-2'>
				{data.unidades.map(unidad => (
					<div
						key={`${unidad.fila_origen}-${unidad.identificador_unidad}`}
						className='flex items-center justify-between gap-3 text-xs'
					>
						<span className='font-medium text-foreground'>
							{unidad.identificador_unidad}
						</span>
						<span className='text-muted-foreground'>{unidad.prorrateo} %</span>
					</div>
				))}
			</div>
		</div>
	)
}
