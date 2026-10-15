'use client'

import PermissionGuard from '@/components/layouts/guards/permission-guard'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { useActualizarProbabilidadCierreEjecutivo } from '@/hooks/procesos-comerciales/use-actualizar-probabilidad-cierre-ejecutivo'
import { useUserSession } from '@/hooks/auth/use-user-session'
import type { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type ProbabilidadCierreCellProps = {
	proceso: ProcesoComercial
	idProspecto: number
	ejecutivoComercialRut?: string
}

const OPCIONES_PROBABILIDAD = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

// Radix Select no admite items con value vacío, se usa un centinela
// para representar "sin estimación del ejecutivo" (usa la del sistema)
const VALOR_SISTEMA = 'sistema'

// Trigger con estética de texto plano: el borde punteado y el fondo solo
// aparecen al hacer hover, insinuando que el valor es editable sin añadir
// un botón "Editar" que rompa la lectura del resumen.
const TRIGGER_FANTASMA =
	"-mx-1.5 max-w-44 rounded border-dashed border-transparent bg-transparent px-1.5 py-0.5 text-sm font-medium text-foreground shadow-none hover:border-border/60 hover:bg-muted/60 focus-visible:ring-ring/20 data-[size=sm]:h-auto data-[size=default]:h-auto [&_svg:not([class*='size-'])]:size-3"

function formatearPorcentaje(valor: number): string {
	return `${Math.round(valor * 100)}%`
}

function obtenerValorInicial(proceso: ProcesoComercial): string {
	if (proceso.probabilidad_cierre_ejecutivo === null) {
		return VALOR_SISTEMA
	}

	return String(Math.round(proceso.probabilidad_cierre_ejecutivo * 100))
}

export default function ProbabilidadCierreCell({
	proceso,
	idProspecto,
	ejecutivoComercialRut,
}: ProbabilidadCierreCellProps) {
	const { usuario } = useUserSession()
	// Estado local optimista: se pinta al instante y se revierte si el guardado falla.
	const [valor, setValor] = useState(() => obtenerValorInicial(proceso))
	const actualizarProbabilidad =
		useActualizarProbabilidadCierreEjecutivo(idProspecto)

	const puedeEditar = !proceso.cerrado && usuario?.rut === ejecutivoComercialRut
	const guardando = actualizarProbabilidad.isPending

	const valorEnLectura =
		proceso.probabilidad_cierre_ejecutivo !== null
			? formatearPorcentaje(proceso.probabilidad_cierre_ejecutivo)
			: '—'

	async function cambiarValor(nuevo: string) {
		if (nuevo === valor) return

		const anterior = valor
		setValor(nuevo)

		try {
			await actualizarProbabilidad.mutateAsync({
				idProceso: proceso.id,
				request: {
					probabilidad_cierre_ejecutivo:
						nuevo === VALOR_SISTEMA ? null : Number(nuevo) / 100,
				},
			})
			toast.success('Probabilidad de cierre actualizada')
		} catch {
			setValor(anterior)
			toast.error('Error al actualizar la probabilidad de cierre')
		}
	}

	return (
		<div className='min-w-0'>
			<p className='text-xs text-muted-foreground'>
				Probabilidad estimada por el ejecutivo
			</p>

			{puedeEditar ? (
				<PermissionGuard
					allowedPermissions={['ADMINISTRAR_PROCESOS_COMERCIALES_PROPIOS']}
					fallback={
						<p className='mt-0.5 text-sm font-medium tabular-nums text-foreground'>
							{valorEnLectura}
						</p>
					}
				>
					<div className='mt-0.5 flex items-center gap-1.5'>
						<Select
							value={valor}
							onValueChange={cambiarValor}
							disabled={guardando}
						>
							<SelectTrigger size='sm' className={TRIGGER_FANTASMA}>
								<SelectValue placeholder='Sin estimación' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={VALOR_SISTEMA}>
									Sin estimación (usar sistema)
								</SelectItem>
								{OPCIONES_PROBABILIDAD.map(opcion => (
									<SelectItem key={opcion} value={String(opcion)}>
										{opcion}%
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{guardando ? (
							<Loader2
								className='size-3.5 shrink-0 animate-spin text-muted-foreground'
								aria-hidden
							/>
						) : null}
					</div>
				</PermissionGuard>
			) : (
				<p className='mt-0.5 text-sm font-medium tabular-nums text-foreground'>
					{valorEnLectura}
				</p>
			)}
		</div>
	)
}
