'use client'

import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import EstadoCompletitudInformacion from '@/components/estado-completitud-informacion/estado-completitud-informacion'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import { useHistorialEstadoDialog } from '@/hooks/historial-estado/use-historial-estado-dialog'
import { ESTADO_PROSPECTO_LABELS } from '@/types/estados/estado-comercial-cliente'
import { formatearFecha } from '@/utils/formatear-fecha'
import { Building2 } from 'lucide-react'
import Link from 'next/link'
import HistorialEstados from '../historial-estados/historial-estados'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import AdministradorAsociado from './administrador-asociado/administrador-asociado'

type PaginaProspectoHeaderProps = {
	prospecto: Prospecto
}

const PaginaProspectoHeader = ({ prospecto }: PaginaProspectoHeaderProps) => {
	/*const ultimoEstado =
		prospecto.proceso_comercial.historial_estados[
			prospecto.proceso_comercial.historial_estados.length - 1
		]*/

	const ultimoEstado = 'No informado'

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
						{prospecto.linea_negocio.nombre.toLowerCase() == 'condominio' && (
							<AdministradorAsociado
								administrador={(prospecto as ProspectoCondominio).administrador}
							/>
						)}
						<div className='flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground'>
							<span>
								<span className='text-muted-foreground'>
									Ejecutivo asignado:
								</span>{' '}
								<span className='font-medium text-foreground'>
									{prospecto.ejecutivo_comercial_asignado?.nombre ?? '—'}
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
									className={ESTADO_COMERCIAL_BADGE['OPORTUNIDAD_CREADA']}
								>
									{ESTADO_PROSPECTO_LABELS['OPORTUNIDAD_CREADA']}
								</Badge>
								{/*onClick={abrirDialogHistorialEstado}*/}
								<Button
									type='button'
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

			{/**<HistorialEstados
				prospecto={prospecto}
				openHistorialEstadoDialog={openHistorialEstadoDialog}
				setOpenHistorialEstadoDialog={setOpenHistorialEstadoDialog}
			/> */}
		</Card>
	)
}

export default PaginaProspectoHeader
