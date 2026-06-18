'use client'

import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Dialog, DialogContent } from '@/components/dialog'
import { Input } from '@/components/input'
import FormularioRegistrarProspecto from '@/components/formulario-registrar-prospecto/formulario-registrar-prospecto'
import { useControlledInput } from '@/hooks/input/use-controlled-input'
import { useFiltrosProspectos } from '@/hooks/prospectos/use-filtros-prospectos'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import FilaProspecto from './fila-prospecto'
import { FiltrosEstadoProspecto } from './filtros-estado-prospecto/filtros-estado-prospecto'

type CardProspectosClientProps = {
	prospectos?: ProspectoResumenJson[]
}

export default function CardProspectosClient({
	prospectos,
}: CardProspectosClientProps) {
	const { value: busqueda, handleChange } = useControlledInput()
	const { filtro, prospectosFiltrados, cambiarFiltro, contarFiltro } =
		useFiltrosProspectos(prospectos)

	const queryClient = useQueryClient()

	const [
		openFormularioRegistrarProspecto,
		setOpenFormularioRegistrarProspecto,
	] = useState<boolean>(false)

	const onProspectoRegistrado = () => {
		queryClient.invalidateQueries({ queryKey: ['prospectos'] })
	}

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle primary>Búsqueda de prospectos</CardTitle>
				<div className='flex shrink-0 flex-wrap gap-1.5'>
					<Button size='sm' variant='outline' className='h-9 text-xs'>
						<Plus className='mr-1.5 h-3.5 w-3.5' aria-hidden />
						Prospecto
					</Button>
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
						className='h-9 pl-9 text-sm shadow-none'
						value={busqueda}
						onChange={handleChange}
					/>
				</div>

				<FiltrosEstadoProspecto
					prospectos={prospectos}
					filtroActivo={filtro}
					onFiltroChange={cambiarFiltro}
					contarFiltro={contarFiltro}
				/>

				<div className='space-y-2'>
					<p className='text-[11px] text-muted-foreground'>
						{prospectosFiltrados.length} cliente
						{prospectosFiltrados.length !== 1 ? 's' : ''}
						{filtro !== 'todos' ? (
							<>
								{' '}
								· <span className='text-foreground'>{filtro}</span>
							</>
						) : null}
						{busqueda.trim() && prospectosFiltrados.length > 0
							? ` · ${prospectosFiltrados.length} prospecto${prospectosFiltrados.length !== 1 ? 's' : ''} en búsqueda`
							: ''}
					</p>
					<div className='max-h-[min(52vh,420px)] space-y-2 overflow-y-auto rounded-md border border-border p-1.5'>
						{prospectosFiltrados.length === 0 && (
							<p className='py-6 text-center text-xs text-muted-foreground'>
								No hay clientes con este estado
								{busqueda.trim() ? ' que coincidan con la búsqueda' : ''}.
							</p>
						)}

						{prospectosFiltrados.map(prospecto => (
							<FilaProspecto key={prospecto.id} prospecto={prospecto} />
						))}
						{busqueda.trim() &&
							prospectosFiltrados.map(prospecto => (
								<FilaProspecto
									key={prospecto.id}
									prospecto={prospecto}
									className='border-violet-500/25 bg-violet-500/4'
								/>
							))}
					</div>
				</div>

				<Button
					type='button'
					variant='outline'
					size='sm'
					className='h-8 w-full text-xs'
				>
					Ver todos los clientes asignados ({prospectos?.length ?? 0})
				</Button>
			</CardContent>

			<Dialog
				open={openFormularioRegistrarProspecto}
				onOpenChange={(open: boolean) =>
					setOpenFormularioRegistrarProspecto(open)
				}
			>
				<DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto p-0'>
					<div className='border-b border-border px-6 py-4'>
						<h2 className='text-lg font-semibold'>Registrar prospecto</h2>
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
