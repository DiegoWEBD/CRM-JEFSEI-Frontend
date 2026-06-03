'use client'

import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { Badge } from '@/components/badge/badge'
import Button from '@/components/button/button'
import Card from '@/components/card/card'
import CardContent from '@/components/card/card-content/card-content'
import EstadoCompletitudInformacion from '@/components/estado-completitud-informacion/estado-completitud-informacion'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { useHistorialEstadoDialog } from '@/hooks/historial-estado/use-historial-estado-dialog'
import { ESTADO_PROSPECTO_LABELS } from '@/types/estados/estado-comercial-cliente'
import { formatearFecha } from '@/utils/formatear-fecha'
import { Building2 } from 'lucide-react'
import Link from 'next/link'
import HistorialEstados from '../historial-estados/historial-estados'

type PaginaProspectoHeaderProps = {
	prospecto: ProspectoCondominio
}

const PaginaProspectoHeader = ({ prospecto }: PaginaProspectoHeaderProps) => {
	const ultimoEstado =
		prospecto.proceso_comercial.historial_estados[
			prospecto.proceso_comercial.historial_estados.length - 1
		]

	const {
		openHistorialEstadoDialog,
		abrirDialogHistorialEstado,
		setOpenHistorialEstadoDialog,
	} = useHistorialEstadoDialog()

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardContent className='p-4 sm:p-5'>
				<div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
					<div className='min-w-0 space-y-3'>
						<div className='flex flex-wrap items-center gap-2'>
							<Building2
								className='h-5 w-5 shrink-0 text-muted-foreground'
								aria-hidden
							/>
							<h1 className='text-lg font-semibold leading-tight text-foreground sm:text-xl'>
								{prospecto.nombre_riesgo}
							</h1>
						</div>
						<div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
							<span>
								<span className='text-foreground'>Administrador asociado:</span>{' '}
								{prospecto.nombre_contacto.trim() ? (
									<span className='font-medium text-foreground'>
										{prospecto.nombre_contacto}
									</span>
								) : (
									'—'
								)}
							</span>
							{prospecto.nombre_contacto ? (
								<Button
									variant='outline'
									size='sm'
									className='px-2 text-[10px]'
									asChild
								>
									<Link href={`/clientes/${prospecto.nombre_contacto}`}>
										Ver perfil
									</Link>
								</Button>
							) : null}
						</div>
						<div className='flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground'>
							<span>
								<span className='text-muted-foreground'>
									Ejecutivo asignado:
								</span>{' '}
								<span className='font-medium text-foreground'>
									{prospecto.proceso_comercial.ejecutivo_comercial?.nombre ??
										'—'}
								</span>
							</span>
							<span className='hidden sm:inline'>·</span>
							<span className='tabular-nums'>
								<span className='text-muted-foreground'>
									Última actualización:
								</span>{' '}
								{formatearFecha(
									new Date(prospecto.ultima_actualizacion),
									'dd-MM-yyyy · HH:mm',
								)}
							</span>
						</div>
					</div>
					<div className='flex flex-col gap-3 sm:flex-row sm:gap-6 lg:flex-col lg:items-end lg:gap-3 lg:pt-0.5'>
						<div className='flex flex-col items-start gap-1.5 lg:items-end'>
							<span className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
								Estado general del prospecto
							</span>
							<div className='flex flex-wrap items-center gap-2'>
								<Badge
									variant='outline'
									className={ESTADO_COMERCIAL_BADGE[ultimoEstado.estado_actual]}
								>
									{ESTADO_PROSPECTO_LABELS[ultimoEstado.estado_actual]}
								</Badge>
								<Button
									type='button'
									onClick={abrirDialogHistorialEstado}
									variant='ghost'
									size='sm'
									className='h-7 px-2 text-[10px] text-muted-foreground hover:text-foreground'
								>
									Ver historial
								</Button>
							</div>
						</div>
						<div className='flex flex-col items-start gap-1.5 lg:items-end'>
							<span className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
								Estado de la información
							</span>
							<EstadoCompletitudInformacion
								completa={prospecto.informacion_completa}
							/>
						</div>
					</div>
				</div>
			</CardContent>

			<HistorialEstados
				prospecto={prospecto}
				openHistorialEstadoDialog={openHistorialEstadoDialog}
				setOpenHistorialEstadoDialog={setOpenHistorialEstadoDialog}
			/>
		</Card>
	)
}

export default PaginaProspectoHeader
