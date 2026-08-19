import { Button } from '@/components/button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

type PaginacionProps = {
	pagina: number
	totalPaginas: number
	onPaginaChange: (pagina: number) => void
}

function generarPaginas(pagina: number, totalPaginas: number): (number | 'ellipsis')[] {
	if (totalPaginas <= 7) {
		return Array.from({ length: totalPaginas }, (_, i) => i + 1)
	}

	const paginas: (number | 'ellipsis')[] = [1]

	if (pagina > 3) {
		paginas.push('ellipsis')
	}

	const inicio = Math.max(2, pagina - 1)
	const fin = Math.min(totalPaginas - 1, pagina + 1)

	for (let i = inicio; i <= fin; i++) {
		paginas.push(i)
	}

	if (pagina < totalPaginas - 2) {
		paginas.push('ellipsis')
	}

	paginas.push(totalPaginas)

	return paginas
}

export default function Paginacion({
	pagina,
	totalPaginas,
	onPaginaChange,
}: PaginacionProps) {
	if (totalPaginas <= 1) return null

	const paginas = generarPaginas(pagina, totalPaginas)

	return (
		<div className='mt-3 flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 sm:flex-row sm:justify-between sm:gap-3'>
			<p className='text-xs text-muted-foreground'>
				Página {pagina} de {totalPaginas}
			</p>
			<div className='flex items-center gap-1'>
				<Button
					type='button'
					variant='outline'
					size='sm'
					className='h-8 rounded-lg px-2 text-xs'
					onClick={() => onPaginaChange(pagina - 1)}
					disabled={pagina <= 1}
				>
					<ChevronLeft className='h-3.5 w-3.5' aria-hidden />
				</Button>

				{paginas.map((p, i) =>
					p === 'ellipsis' ? (
						<span
							key={`ellipsis-${i}`}
							className='flex h-8 w-8 items-center justify-center text-muted-foreground'
						>
							<MoreHorizontal className='h-3.5 w-3.5' />
						</span>
					) : (
						<Button
							key={p}
							type='button'
							variant={p === pagina ? 'default' : 'outline'}
							size='sm'
							className='h-8 min-w-8 rounded-lg px-2 text-xs'
							onClick={() => onPaginaChange(p)}
						>
							{p}
						</Button>
					),
				)}

				<Button
					type='button'
					variant='outline'
					size='sm'
					className='h-8 rounded-lg px-2 text-xs'
					onClick={() => onPaginaChange(pagina + 1)}
					disabled={pagina >= totalPaginas}
				>
					<ChevronRight className='h-3.5 w-3.5' aria-hidden />
				</Button>
			</div>
		</div>
	)
}
