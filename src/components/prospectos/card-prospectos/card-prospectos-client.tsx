'use client'

import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/dialog'
import FormularioRegistrarProspecto from '@/components/formulario-registrar-prospecto/formulario-registrar-prospecto'
import { Input } from '@/components/input'
import Paginacion from '@/components/paginacion/paginacion'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { useState } from 'react'
import FilaProspecto from './fila-prospecto'
import FiltroEjecutivo from './filtro-ejecutivo'
import FiltroRegionComuna from './filtro-region-comuna'
import SkeletonFilasProspecto from './skeleton-filas-prospecto'
import { FiltrosEstadoProspecto } from './filtros-estado-prospecto/filtros-estado-prospecto'
import { CardProspectosSkeleton } from '@/components/prospectos/card-prospectos/card-prospectos-skeleton'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import { ProspectosFiltros } from '@/app/prospectos/components/dto/prospectos-filtros'

const TAMANO_PAGINA = 10

type CardProspectosClientProps = {
	filtroExterno?: string | null
	onFiltroChange?: (valor: string) => void
	filtros: ProspectosFiltros
	setFiltros: (filtros: ProspectosFiltros) => void
}

export default function CardProspectosClient({
	filtroExterno,
	onFiltroChange: onFiltroChangeProp,
	filtros,
	setFiltros,
}: CardProspectosClientProps) {
	const textoBusqueda = useDebounce(filtros.inputValue, 300)

	const queryClient = useQueryClient()

	const [
		openFormularioRegistrarProspecto,
		setOpenFormularioRegistrarProspecto,
	] = useState<boolean>(false)

	const filtro = filtroExterno ?? filtros.filtroInterno

	const { data, isFetching } = useObtenerProspectos(
		filtro === 'todos' ? null : filtro,
		textoBusqueda,
		filtros.pagina,
		TAMANO_PAGINA,
		filtros.rutUsuario || null,
		filtros.region || null,
		filtros.comuna || null,
	)

	const response = data

	if (!response) return <CardProspectosSkeleton />

	const esConsultaInicial =
		filtro === 'todos' &&
		textoBusqueda === '' &&
		filtros.pagina === 1 &&
		!filtros.rutUsuario &&
		!filtros.region &&
		!filtros.comuna
	const buscandoEnDebounce = filtros.inputValue !== textoBusqueda
	const mostrandoEsqueleto = isFetching && !esConsultaInicial

	const onFiltroChange = (valor: string) => {
		if (onFiltroChangeProp) {
			onFiltroChangeProp(valor)
		} else {
			setFiltros({ ...filtros, filtroInterno: valor })
		}
		setFiltros({ ...filtros, pagina: 1 })
	}

	const onBusquedaChange = (valor: string) => {
		setFiltros({ ...filtros, inputValue: valor, pagina: 1 })
	}

	const onRutUsuarioChange = (valor: string) => {
		setFiltros({ ...filtros, rutUsuario: valor, pagina: 1 })
	}

	const onRegionChange = (valor: string) => {
		setFiltros({ ...filtros, region: valor, comuna: '', pagina: 1 })
	}

	const onComunaChange = (valor: string) => {
		setFiltros({ ...filtros, comuna: valor, pagina: 1 })
	}

	const onProspectoRegistrado = () => {
		queryClient.invalidateQueries({ queryKey: ['prospectos'] })
	}

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle primary>Búsqueda de prospectos</CardTitle>
				<div className='flex shrink-0 flex-wrap gap-1.5'>
					<Button
						size='sm'
						className='h-9 text-xs'
						onClick={() => setOpenFormularioRegistrarProspecto(true)}
					>
						<Plus className='mr-1.5 h-3.5 w-3.5' aria-hidden />
						Cliente
					</Button>
				</div>
			</CardHeader>
			<CardContent className='space-y-3 p-4'>
				<div className='relative'>
					<Search
						className='absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'
						aria-hidden
					/>
					<Input
						placeholder='Nombre, rut, estado comercial, correo, teléfono o contacto'
						className='h-9 pr-9 pl-9 text-sm shadow-none'
						value={filtros.inputValue}
						onChange={e => onBusquedaChange(e.target.value)}
					/>
					{filtros.inputValue && (
						<Button
							type='button'
							variant='ghost'
							className='absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground'
							onClick={() => onBusquedaChange('')}
							aria-label='Limpiar búsqueda'
						>
							<X className='h-3.5 w-3.5' aria-hidden />
						</Button>
					)}
				</div>

				<FiltrosEstadoProspecto
					contadoresEstado={response.contadores_estado}
					total={response.total}
					filtroActivo={filtro}
					onFiltroChange={onFiltroChange}
				/>

				<div className='flex flex-col gap-2 sm:flex-row'>
					<AuthGuard
						allowedRoles={[
							'GERENTE_GENERAL',
							'GERENTE_COMERCIAL',
							'GERENTE_OPERACIONES',
						]}
					>
						<FiltroEjecutivo
							value={filtros.rutUsuario}
							onChange={onRutUsuarioChange}
						/>
					</AuthGuard>

					<FiltroRegionComuna
						region={filtros.region}
						comuna={filtros.comuna}
						onRegionChange={onRegionChange}
						onComunaChange={onComunaChange}
					/>
				</div>

				<div className='space-y-2'>
					<p className='text-sm text-muted-foreground'>
						{filtro === 'todos' ? (
							`Total de prospectos: ${response.total}`
						) : (
							<>
								{response.data.length} cliente
								{response.data.length !== 1 ? 's' : ''} ·{' '}
								<span className='text-foreground'>{filtro}</span>
							</>
						)}
						{textoBusqueda.trim()
							? ` · ${response.total} prospecto${response.total !== 1 ? 's' : ''} en búsqueda`
							: ''}
					</p>
					<div className='relative max-h-[min(52vh,420px)] overflow-y-auto divide-y divide-border rounded-md border border-border'>
						{buscandoEnDebounce && !isFetching && (
							<div className='pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse bg-primary/50' />
						)}
						{mostrandoEsqueleto ? (
							<SkeletonFilasProspecto />
						) : response.data.length === 0 ? (
							<p className='py-6 text-center text-xs text-muted-foreground'>
								No hay clientes con este estado
								{textoBusqueda.trim() ? ' que coincidan con la búsqueda' : ''}.
							</p>
						) : (
							response.data.map(prospecto => (
								<FilaProspecto
									key={prospecto.id}
									prospecto={prospecto}
									textoBusqueda={textoBusqueda}
									className={
										textoBusqueda.trim()
											? 'bg-violet-500/4 hover:bg-violet-500/8'
											: undefined
									}
								/>
							))
						)}
					</div>
					<Paginacion
						pagina={response.pagina}
						totalPaginas={response.total_paginas}
						onPaginaChange={pagina => setFiltros({ ...filtros, pagina })}
					/>
				</div>
			</CardContent>

			<Dialog
				open={openFormularioRegistrarProspecto}
				onOpenChange={(open: boolean) =>
					setOpenFormularioRegistrarProspecto(open)
				}
			>
				<DialogContent className='max-h-[90vh] sm:max-w-5xl overflow-y-auto p-0'>
					<div className='border-b border-border px-6 py-4'>
						<DialogTitle className='text-lg font-semibold'>
							Registrar prospecto
						</DialogTitle>
						<p className='text-sm text-muted-foreground'>
							Completa los datos del prospecto para crear un nuevo registro.
						</p>
					</div>
					<div className='px-6 py-4'>
						<FormularioRegistrarProspecto
							onClose={() => setOpenFormularioRegistrarProspecto(false)}
							onProspectoRegistrado={onProspectoRegistrado}
						/>
					</div>
				</DialogContent>
			</Dialog>
		</Card>
	)
}
