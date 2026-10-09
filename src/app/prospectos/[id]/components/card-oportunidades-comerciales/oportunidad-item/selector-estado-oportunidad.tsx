'use client'

import { Badge } from '@/components/badge'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import type { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { useUserSession } from '@/hooks/auth/use-user-session'
import { useCambiarEstadoManual } from '@/hooks/procesos-comerciales/use-cambiar-estado-manual'
import { useTransicionesManuales } from '@/hooks/estados/use-transiciones-manuales'
import { ESTADO_PROSPECTO_LABELS } from '@/types/estados/estado-comercial-cliente'
import { ChevronDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { TransicionManual } from '@/aplicacion/estados/use-cases/obtener-transiciones-manuales/dto/transicion-manual'

type SelectorEstadoOportunidadProps = {
	proceso: ProcesoComercial
	idProspecto: number
	ejecutivoComercialRut?: string
}

function labelEstado(codigo: string, nombre?: string) {
	return (
		ESTADO_PROSPECTO_LABELS[codigo as keyof typeof ESTADO_PROSPECTO_LABELS] ??
		nombre ??
		codigo
	)
}

function variantEstado(codigo: string) {
	return (
		ESTADO_COMERCIAL_BADGE[codigo as keyof typeof ESTADO_COMERCIAL_BADGE] ??
		'outline'
	)
}

export default function SelectorEstadoOportunidad({
	proceso,
	idProspecto,
	ejecutivoComercialRut,
}: SelectorEstadoOportunidadProps) {
	const { usuario } = useUserSession()
	const { data: transiciones, isLoading: cargandoTransiciones } =
		useTransicionesManuales(proceso.estado_actual.codigo)
	const cambiarEstado = useCambiarEstadoManual(idProspecto)

	const puedeEditar = !proceso.cerrado && usuario?.rut === ejecutivoComercialRut

	if (!puedeEditar) {
		return null
	}

	const codigoEstadoActual = proceso.estado_actual.codigo
	const tieneTransiciones = (transiciones?.length ?? 0) > 0
	const pendiente = cambiarEstado.isPending

	async function cambiarEstadoA(transicion: TransicionManual) {
		try {
			await cambiarEstado.mutateAsync({
				idProceso: proceso.id,
				request: {
					codigo_estado_destino: transicion.codigo,
					observacion: transicion.accion_requerida ?? null,
				},
			})
			toast.success('Estado de la oportunidad actualizado')
		} catch {
			toast.error('Error al cambiar el estado de la oportunidad')
		}
	}

	return (
		<>
			<p className='mb-1.5 text-xs text-muted-foreground'>Estado actual</p>

			{tieneTransiciones ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Badge
							asChild
							variant={variantEstado(codigoEstadoActual)}
							className='cursor-pointer gap-1 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60'
						>
							<button type='button' disabled={pendiente}>
								{labelEstado(codigoEstadoActual, proceso.estado_actual.nombre)}
								{pendiente ? (
									<Loader2 className='h-3 w-3 animate-spin' aria-hidden />
								) : (
									<ChevronDown className='h-3 w-3' aria-hidden />
								)}
							</button>
						</Badge>
					</DropdownMenuTrigger>

					<DropdownMenuContent align='start' className='w-64'>
						{transiciones?.map(transicion => (
							<DropdownMenuItem
								key={transicion.codigo}
								disabled={pendiente}
								onSelect={() => void cambiarEstadoA(transicion)}
								className='flex-col items-start gap-1 cursor-pointer'
							>
								<Badge
									variant={variantEstado(transicion.codigo)}
									className='shrink-0 px-2 py-0.5 text-xs font-semibold leading-none'
								>
									{labelEstado(transicion.codigo, transicion.nombre)}
								</Badge>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<div className='inline-flex items-center gap-1'>
					<Badge
						variant={variantEstado(codigoEstadoActual)}
						className='shrink-0 px-2 py-0.5 text-xs font-semibold leading-none'
					>
						{labelEstado(codigoEstadoActual, proceso.estado_actual.nombre)}
					</Badge>
					{cargandoTransiciones && (
						<Loader2
							className='h-3.5 w-3.5 animate-spin text-muted-foreground'
							aria-hidden
						/>
					)}
				</div>
			)}
		</>
	)
}
