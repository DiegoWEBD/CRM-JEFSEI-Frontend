import Poliza from '@/dominio/poliza/poliza'
import { useAgruparPolizasPorProducto } from '@/hooks/polizas/use-agrupar-polizas-por-producto'
import { useFiltrarPolizas } from '@/hooks/polizas/use-filtrar-polizas'
import ItemPoliza from './item-poliza/item-poliza'

type ContenedorPolizasProps = {
	polizas?: Poliza[]
}

export default function ContenedorPolizas({ polizas }: ContenedorPolizasProps) {
	const { polizasFiltradas, filtro } = useFiltrarPolizas(polizas)
	const { polizasPorProductos } = useAgruparPolizasPorProducto(polizasFiltradas)

	if (polizasFiltradas?.length === 0) {
		return (
			<p className='rounded-md border border-dashed border-border/70 bg-muted/10 px-2.5 py-2 text-xs text-muted-foreground'>
				Aún no hay pólizas registradas para este cliente.
			</p>
		)
	}

	return (
		<div className='space-y-2.5'>
			{filtro ? (
				<p className='text-[10px] text-muted-foreground'>
					Mostrando{' '}
					<span className='font-medium tabular-nums text-foreground'>
						{polizasFiltradas?.length}
					</span>{' '}
					de{' '}
					<span className='font-medium tabular-nums text-foreground'>
						{polizas?.length}
					</span>{' '}
					pólizas (filtros activos)
				</p>
			) : null}
			<ul className='space-y-2'>
				{polizasPorProductos.map(grupo => (
					<li
						key={grupo.producto}
						className='rounded-md border border-border/70 bg-background px-2.5 py-2'
					>
						<p className='text-xs font-semibold text-foreground'>
							{grupo.producto}
						</p>
						{grupo.polizas.length === 0 ? (
							<p className='mt-1 pl-2 text-[11px] text-muted-foreground'>
								Sin pólizas registradas
							</p>
						) : (
							<ul className='mt-1 space-y-1 pl-2'>
								{grupo.polizas.map(poliza => (
									<ItemPoliza key={poliza.numero_poliza} poliza={poliza} />
								))}
							</ul>
						)}
					</li>
				))}
			</ul>
			{polizasFiltradas?.length === 0 && filtro ? (
				<p className='text-center text-[11px] text-muted-foreground'>
					Ninguna póliza coincide con los filtros seleccionados.
				</p>
			) : null}
		</div>
	)
}
