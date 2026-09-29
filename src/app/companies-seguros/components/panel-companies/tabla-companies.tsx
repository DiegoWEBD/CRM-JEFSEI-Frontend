'use client'

import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import Paginacion from '@/components/paginacion/paginacion'
import CompanySeguro from '@/dominio/company-seguro/company-seguro'
import { Calculator, Pencil, Trash2 } from 'lucide-react'
import { Skeleton } from '@/components/skeleton'

import ResumenFactoresCuotas from './resumen-factores-cuotas'

type TablaCompaniesProps = {
	companies: CompanySeguro[]
	isFetching: boolean
	pagina: number
	totalPaginas: number
	onPaginaChange: (pagina: number) => void
	onEditar: (company: CompanySeguro) => void
	onFactores: (company: CompanySeguro) => void
	onEliminar: (company: CompanySeguro) => void
}

function Acciones({
	company,
	onEditar,
	onFactores,
	onEliminar,
}: {
	company: CompanySeguro
	onEditar: (company: CompanySeguro) => void
	onFactores: (company: CompanySeguro) => void
	onEliminar: (company: CompanySeguro) => void
}) {
	return (
		<div className='flex items-center justify-end gap-1'>
			<PermissionGuard allowedPermissions={['ADMINISTRAR_COMPANIES']}>
				<Button
					variant='ghost'
					size='icon'
					className='size-8'
					title='Renombrar compañía'
					onClick={() => onEditar(company)}
				>
					<Pencil className='size-4' />
				</Button>
			</PermissionGuard>

			<PermissionGuard allowedPermissions={['ADMINISTRAR_COMPANIES']}>
				<Button
					variant='ghost'
					size='icon'
					className='size-8'
					title='Editar factores de cuotas'
					onClick={() => onFactores(company)}
				>
					<Calculator className='size-4' />
				</Button>
			</PermissionGuard>

			<PermissionGuard allowedPermissions={['ADMINISTRAR_COMPANIES']}>
				<Button
					variant='ghost'
					size='icon'
					className='size-8 text-destructive hover:text-destructive'
					title='Eliminar compañía'
					onClick={() => onEliminar(company)}
				>
					<Trash2 className='size-4' />
				</Button>
			</PermissionGuard>
		</div>
	)
}

export default function TablaCompanies({
	companies,
	isFetching,
	pagina,
	totalPaginas,
	onPaginaChange,
	onEditar,
	onFactores,
	onEliminar,
}: TablaCompaniesProps) {
	if (isFetching) {
		return (
			<div className='space-y-2'>
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className='h-12 w-full rounded-md' />
				))}
			</div>
		)
	}

	if (companies.length === 0) {
		return (
			<div className='flex items-center justify-center py-12'>
				<p className='text-sm text-muted-foreground'>
					No se encontraron compañías
				</p>
			</div>
		)
	}

	return (
		<>
			{/* Mobile: cards */}
			<div className='space-y-3 lg:hidden'>
				<Paginacion
					pagina={pagina}
					totalPaginas={totalPaginas}
					onPaginaChange={onPaginaChange}
				/>

				{companies.map(company => (
					<Card key={company.id} className='border-border bg-card shadow-none'>
						<CardContent className='p-4'>
							<div className='flex items-start justify-between gap-2'>
								<div className='min-w-0 flex-1 space-y-1.5'>
									<p className='truncate text-sm font-semibold text-foreground'>
										{company.nombre}
									</p>
									<ResumenFactoresCuotas factores={company.factores_cuotas} />
								</div>
								<div className='flex shrink-0 gap-1'>
									<Acciones
										company={company}
										onEditar={onEditar}
										onFactores={onFactores}
										onEliminar={onEliminar}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Desktop: tabla densa */}
			<div className='hidden lg:block'>
				<Paginacion
					pagina={pagina}
					totalPaginas={totalPaginas}
					onPaginaChange={onPaginaChange}
				/>

				<div className='overflow-x-auto rounded-lg border border-border'>
					<table className='w-full table-fixed text-sm'>
						<thead>
							<tr className='border-b border-border bg-muted/40'>
								<th className='w-[26%] px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Nombre
								</th>
								<th className='w-[56%] px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Factores de cuotas
								</th>
								<th className='w-[18%] px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground'>
									Acciones
								</th>
							</tr>
						</thead>
						<tbody>
							{companies.map(company => (
								<tr
									key={company.id}
									className='border-b border-border/50 transition-colors hover:bg-accent/50 last:border-b-0'
								>
									<td className='px-4 py-2.5'>
										<p className='truncate font-semibold text-foreground'>
											{company.nombre}
										</p>
									</td>
									<td className='px-4 py-2.5'>
										<ResumenFactoresCuotas
											compacto
											factores={company.factores_cuotas}
										/>
									</td>
									<td className='px-4 py-2.5'>
										<Acciones
											company={company}
											onEditar={onEditar}
											onFactores={onFactores}
											onEliminar={onEliminar}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}
