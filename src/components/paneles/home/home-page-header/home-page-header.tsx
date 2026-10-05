'use client'

import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { Button } from '@/components/button'
import DialogCrearRecordatorio from '@/components/dialog-crear-recordatorio/dialog-crear-recordatorio'
import AuthGuard from '@/components/layouts/guards/auth-guard'
import { formatearFecha } from '@/utils/formatear-fecha'
import { Plus } from 'lucide-react'
import { ReactNode, useState } from 'react'

type HomePageHeaderProps = {
	nombreUsuario: string
	prospectos?: ProspectoResumenJson[]
	accionesExtra?: ReactNode
}

export default function HomePageHeader({
	nombreUsuario,
	prospectos,
	accionesExtra,
}: HomePageHeaderProps) {
	const [openCrearRecordatorio, setOpenCrearRecordatorio] = useState(false)

	const hoy = new Date()
	const fechaLarga = formatearFecha(hoy, "EEEE d 'de' MMMM 'de' yyyy")

	return (
		<>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
				<div className='flex flex-col gap-0.5'>
					<h1 className='text-xl font-semibold tracking-tight text-foreground sm:text-2xl'>
						Panel de inicio
					</h1>
					<p className='text-sm text-muted-foreground'>
						{nombreUsuario
							? `Hola, ${nombreUsuario.split(' ')[0]} · Resumen de tu operación de hoy`
							: 'Resumen de tu operación de hoy'}
					</p>
				</div>
				<div className='flex flex-wrap items-center gap-2'>
					<p className='hidden text-xs capitalize text-muted-foreground lg:block'>
						{fechaLarga}
					</p>
					{accionesExtra}
					<AuthGuard
						fallback={null}
						allowedRoles={['EJECUTIVO_EVALUACION_PROYECTOS']}
					>
						<Button
							asChild
							variant='outline'
							size='sm'
							className='h-8 gap-1 text-xs'
						>
							<a href='/solicitudes-estudio'>Solicitudes de estudio</a>
						</Button>
						<Button
							asChild
							variant='outline'
							size='sm'
							className='h-8 gap-1 text-xs'
						>
							<a href='/cotizaciones-estudios-emitidos'>
								Cotizaciones emitidas
							</a>
						</Button>
					</AuthGuard>
					<Button
						type='button'
						variant='outline'
						size='sm'
						className='h-8 gap-1 text-xs'
						onClick={() => setOpenCrearRecordatorio(true)}
					>
						<Plus className='h-3.5 w-3.5' aria-hidden />
						Nuevo recordatorio
					</Button>
				</div>
			</div>

			<DialogCrearRecordatorio
				open={openCrearRecordatorio}
				onOpenChange={setOpenCrearRecordatorio}
				prospectos={prospectos}
			/>
		</>
	)
}
