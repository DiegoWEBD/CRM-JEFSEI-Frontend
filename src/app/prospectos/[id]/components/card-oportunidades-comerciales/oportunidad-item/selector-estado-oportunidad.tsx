'use client'

import type { TransicionManual } from '@/aplicacion/estados/use-cases/obtener-transiciones-manuales/dto/transicion-manual'
import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { Badge } from '@/components/badge'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import type { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { useUserSession } from '@/hooks/auth/use-user-session'
import { useTransicionesManuales } from '@/hooks/estados/use-transiciones-manuales'
import { useCambiarEstadoManual } from '@/hooks/procesos-comerciales/use-cambiar-estado-manual'
import { cn } from '@/lib/utils'
import { ChevronDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type SelectorEstadoOportunidadProps = {
	proceso: ProcesoComercial
	idProspecto: number
	ejecutivoComercialRut?: string
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
					<DropdownMenuTrigger asChild disabled={!puedeEditar}>
						<Badge
							asChild
							variant={variantEstado(codigoEstadoActual)}
							className={cn(
								puedeEditar && 'cursor-pointer hover:opacity-80',
								'gap-1 transition-opacity disabled:cursor-not-allowed disabled:opacity-60',
							)}
						>
							{
								<button type='button' disabled={pendiente}>
									{proceso.estado_actual.nombre}

									{pendiente && (
										<Loader2 className='h-3 w-3 animate-spin' aria-hidden />
									)}
									{!pendiente && puedeEditar && (
										<ChevronDown className='h-3 w-3' aria-hidden />
									)}
								</button>
							}
						</Badge>
					</DropdownMenuTrigger>

					<DropdownMenuContent align='start' className='w-54'>
						{transiciones?.map(transicion => (
							<DropdownMenuItem
								key={transicion.codigo}
								disabled={pendiente}
								onSelect={() => void cambiarEstadoA(transicion)}
								className='cursor-pointer w-full'
							>
								<Badge
									variant={variantEstado(transicion.codigo)}
									className='shrink-0 p-1 text-xs leading-none w-full'
								>
									{transicion.nombre}
								</Badge>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<div className='inline-flex items-center gap-1'>
					<Badge
						variant={variantEstado(codigoEstadoActual)}
						className='shrink-0 p-1 text-xs leading-none'
					>
						{proceso.estado_actual.nombre}
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
