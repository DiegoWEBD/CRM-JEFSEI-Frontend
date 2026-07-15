'use client'

import { ESTADO_GENERAL_CLIENTE_BADGE, ESTADO_GENERAL_CLIENTE_LABELS, type EstadoGeneralCliente } from '@/lib/estados-cotizaciones'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/sheet'

import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import Link from 'next/link'

type Props = {
	prospectos: ProspectoResumenJson[]
	titulo: string
	abierto: boolean
	onOpenChange: (open: boolean) => void
}

export default function SheetClientesFiltrados({
	prospectos,
	titulo,
	abierto,
	onOpenChange,
}: Props) {
	return (
		<Sheet open={abierto} onOpenChange={onOpenChange}>
			<SheetContent className='flex w-full flex-col gap-0 p-0 sm:max-w-2xl'>
				<SheetHeader className='border-b border-border px-4 py-3 text-left'>
					<SheetTitle className='text-base leading-snug'>{titulo}</SheetTitle>
				</SheetHeader>
				<div className='flex-1 space-y-2 overflow-y-auto p-4'>
					{prospectos.map(prospecto => {
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
											<p className='truncate text-[11px] leading-snug text-muted-foreground'>
												{prospecto.ejecutivo_comercial}
											</p>
										)}
										<div className='flex flex-wrap items-center gap-1.5 pt-0.5'>
										<Badge
											variant={ESTADO_GENERAL_CLIENTE_BADGE[estado]}
											className='text-[10px] font-medium'
										>
												{ESTADO_GENERAL_CLIENTE_LABELS[estado]}
											</Badge>
											<span className='text-[11px] text-muted-foreground'>
												{prospecto.linea_negocio}
											</span>
											{prospecto.nombre_administrador && (
												<span className='text-[11px] text-muted-foreground'>
													· {prospecto.nombre_administrador}
												</span>
											)}
										</div>
									</div>
									<Button
										size='sm'
										variant='outline'
										className='h-7 shrink-0 px-2.5 text-[10px]'
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
					{prospectos.length === 0 && (
						<p className='py-12 text-center text-xs text-muted-foreground'>
							No hay clientes para este indicador.
						</p>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}
