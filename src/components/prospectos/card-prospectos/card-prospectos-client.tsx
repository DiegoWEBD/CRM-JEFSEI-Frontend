'use client'

import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { ESTADO_GENERAL_CLIENTE_BADGE, ESTADO_GENERAL_CLIENTE_LABELS, type EstadoGeneralCliente } from '@/lib/estados-cotizaciones'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/dialog'
import { Input } from '@/components/input'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/sheet'
import FormularioRegistrarProspecto from '@/components/formulario-registrar-prospecto/formulario-registrar-prospecto'
import { cn } from '@/lib/utils'
import { useControlledInput } from '@/hooks/input/use-controlled-input'
import { useFiltrosProspectos } from '@/hooks/prospectos/use-filtros-prospectos'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import FilaProspecto from './fila-prospecto'
import { FiltrosEstadoProspecto } from './filtros-estado-prospecto/filtros-estado-prospecto'

type CardProspectosClientProps = {
	prospectos?: ProspectoResumenJson[]
}

export default function CardProspectosClient({
	prospectos,
}: CardProspectosClientProps) {
	const { value: busqueda, handleChange } = useControlledInput()
	const { filtro, prospectosFiltrados, cambiarFiltro } =
		useFiltrosProspectos(prospectos)

	const queryClient = useQueryClient()

	const [
		openFormularioRegistrarProspecto,
		setOpenFormularioRegistrarProspecto,
	] = useState<boolean>(false)

	const prospectosConBusqueda = useMemo(() => {
		if (!busqueda.trim()) return prospectosFiltrados
		const q = busqueda.trim().toLowerCase()
		return prospectosFiltrados.filter(p => {
			const enNombre = p.nombre_riesgo.toLowerCase().includes(q)
			const enLinea = p.linea_negocio.toLowerCase().includes(q)
			const enAdmin = p.nombre_administrador?.toLowerCase().includes(q) ?? false
			const enEjecutivo =
				p.ejecutivo_comercial?.toLowerCase().includes(q) ?? false
			const enEstado = (p.procesos_comerciales ?? []).some(
				pro =>
					(pro.nombre_estado?.toLowerCase() ?? '').includes(q) ||
					(pro.codigo_estado?.toLowerCase() ?? '').includes(q),
			)
			return enNombre || enLinea || enAdmin || enEjecutivo || enEstado
		})
	}, [busqueda, prospectosFiltrados])

	const [sheetTodosAbierto, setSheetTodosAbierto] = useState<boolean>(false)

	const onProspectoRegistrado = () => {
		queryClient.invalidateQueries({ queryKey: ['prospectos'] })
	}

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardHeader className='flex flex-col gap-2 border-b border-border pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle primary>BÃºsqueda de prospectos</CardTitle>
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
						placeholder='Nombre, rut, estado comercial, correo, telÃ©fono o contacto'
						className='h-9 pl-9 text-sm shadow-none'
						value={busqueda}
						onChange={handleChange}
					/>
				</div>

				<FiltrosEstadoProspecto
					prospectos={prospectos}
					filtroActivo={filtro}
					onFiltroChange={cambiarFiltro}
				/>

				<div className='space-y-2'>
					<p className='text-sm text-muted-foreground'>
						{filtro === 'todos' ? (
							`Total de prospectos: ${prospectos?.length ?? 0}`
						) : (
							<>
								{prospectosConBusqueda.length} cliente
								{prospectosConBusqueda.length !== 1 ? 's' : ''} Â·{' '}
								<span className='text-foreground'>{filtro}</span>
							</>
						)}
						{busqueda.trim() && prospectosConBusqueda.length > 0
							? ` Â· ${prospectosConBusqueda.length} prospecto${prospectosConBusqueda.length !== 1 ? 's' : ''} en bÃºsqueda`
							: ''}
					</p>
					<div className='max-h-[min(52vh,420px)] space-y-2 overflow-y-auto rounded-md border border-border p-1.5'>
						{filtro === 'todos' && !busqueda.trim() ? (
							<p className='py-6 text-center text-xs text-muted-foreground'>
								Total de prospectos: {prospectos?.length ?? 0}
							</p>
						) : prospectosConBusqueda.length === 0 ? (
							<p className='py-6 text-center text-xs text-muted-foreground'>
								No hay clientes con este estado
								{busqueda.trim() ? ' que coincidan con la bÃºsqueda' : ''}.
							</p>
						) : (
							prospectosConBusqueda.map(prospecto => (
								<FilaProspecto
									key={prospecto.id}
									prospecto={prospecto}
									className={
										busqueda.trim()
											? 'border-violet-500/25 bg-violet-500/4'
											: undefined
									}
								/>
							))
						)}
					</div>
				</div>

				<Button
					type='button'
					variant='outline'
					size='sm'
					className='h-8 w-full text-xs'
					onClick={() => setSheetTodosAbierto(true)}
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

			<Sheet open={sheetTodosAbierto} onOpenChange={setSheetTodosAbierto}>
				<SheetContent className='flex w-full flex-col gap-0 p-0 sm:max-w-2xl'>
					<SheetHeader className='border-b border-border px-4 py-3 text-left'>
						<SheetTitle className='text-base leading-snug'>
							Todos los clientes asignados
						</SheetTitle>
					</SheetHeader>
					<div className='flex-1 space-y-2 overflow-y-auto p-4'>
						{prospectos?.map(prospecto => {
							const estado = (prospecto.estado_general_cliente || 'prospecto') as EstadoGeneralCliente
							return (
								<div
									key={prospecto.id}
									className='rounded-md border border-border p-3'
								>
									<div className='flex items-start justify-between gap-3'>
										<div className='min-w-0 flex-1 space-y-0.5'>
											<p className='truncate text-sm font-medium leading-snug text-foreground'>
												{prospecto.nombre_riesgo}
											</p>
											{prospecto.ejecutivo_comercial && (
												<p className='truncate text-sm leading-snug text-muted-foreground'>
													{prospecto.ejecutivo_comercial}
												</p>
											)}
											<div className='flex flex-wrap items-center gap-1.5 pt-0.5'>
											<Badge
												variant={ESTADO_GENERAL_CLIENTE_BADGE[estado]}
												className='text-xs font-medium'
											>
													{ESTADO_GENERAL_CLIENTE_LABELS[estado]}
												</Badge>
												<span className='text-sm text-muted-foreground'>
													{prospecto.linea_negocio}
												</span>
												{prospecto.nombre_administrador && (
													<span className='text-sm text-muted-foreground'>
														Â· {prospecto.nombre_administrador}
													</span>
												)}
											</div>
										</div>
										<Button
											size='sm'
											variant='outline'
											className='h-7 shrink-0 px-2.5 text-xs'
											asChild
										>
											<Link href={`/prospectos/${prospecto.id}`}>
												Ver prospecto
											</Link>
										</Button>
									</div>
								</div>
							)
						})}
						{(!prospectos || prospectos.length === 0) && (
							<p className='py-12 text-center text-xs text-muted-foreground'>
								No hay clientes asignados.
							</p>
						)}
					</div>
				</SheetContent>
			</Sheet>
		</Card>
	)
}
