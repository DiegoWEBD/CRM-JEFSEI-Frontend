'use client'

import { Input } from '@/components/input'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { useActualizarFechaEstimadaCierre } from '@/hooks/procesos-comerciales/use-actualizar-fecha-estimada-cierre'
import { useUserSession } from '@/hooks/auth/use-user-session'
import type { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { formatFechaCorta } from '@/utils/format-fecha-corta'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type FechaEstimadaCierreCellProps = {
	proceso: ProcesoComercial
	idProspecto: number
	ejecutivoComercialRut?: string
}

// Input nativo con estética de texto plano: el borde punteado y el fondo solo
// aparecen al hacer hover/focus, insinuando que la fecha es editable sin un
// botón "Editar" que rompa la lectura del resumen.
const INPUT_FANTASMA =
	'-mx-1.5 h-auto w-auto rounded border-dashed border-transparent bg-transparent px-1.5 py-0.5 text-sm font-medium tabular-nums text-foreground shadow-none hover:border-border/60 hover:bg-muted/60 focus-visible:border-border/60 focus-visible:ring-ring/20'

// El input nativo puede disparar varios "change" mientras el ejecutivo
// completa la fecha; se agrupan en una sola petición.
const RETARDO_GUARDADO_MS = 450

function obtenerFechaInicial(proceso: ProcesoComercial): string {
	return proceso.fecha_estimada_cierre?.slice(0, 10) ?? ''
}

export default function FechaEstimadaCierreCell({
	proceso,
	idProspecto,
	ejecutivoComercialRut,
}: FechaEstimadaCierreCellProps) {
	const { usuario } = useUserSession()
	// Estado local optimista: se pinta al instante y se revierte si el guardado falla.
	const [fecha, setFecha] = useState(() => obtenerFechaInicial(proceso))
	const actualizarFecha = useActualizarFechaEstimadaCierre(idProspecto)
	const guardadoPendiente = useRef<ReturnType<typeof setTimeout> | null>(null)

	const puedeEditar = !proceso.cerrado && usuario?.rut === ejecutivoComercialRut
	const guardando = actualizarFecha.isPending

	// Limpia el debounce si el componente se desmonta a mitad de escritura.
	useEffect(() => {
		return () => {
			if (guardadoPendiente.current) clearTimeout(guardadoPendiente.current)
		}
	}, [])

	async function persistir(nueva: string) {
		try {
			await actualizarFecha.mutateAsync({
				idProceso: proceso.id,
				request: {
					fecha_estimada_cierre: nueva ? nueva : null,
				},
			})
			toast.success('Fecha estimada de cierre actualizada')
		} catch {
			// Revierte al último valor confirmado por el backend.
			setFecha(obtenerFechaInicial(proceso))
			toast.error('Error al actualizar la fecha estimada de cierre')
		}
	}

	function cambiarFecha(nueva: string) {
		setFecha(nueva)

		// El input nativo dispara "change" con '' al borrar; eso sí debe
		// persistirse (la API recibe null). Solo se omite si no cambió.
		if (nueva === obtenerFechaInicial(proceso)) return

		if (guardadoPendiente.current) clearTimeout(guardadoPendiente.current)
		guardadoPendiente.current = setTimeout(() => {
			guardadoPendiente.current = null
			void persistir(nueva)
		}, RETARDO_GUARDADO_MS)
	}

	return (
		<div className='min-w-0'>
			<p className='text-xs text-muted-foreground'>Fecha estimada de cierre</p>

			{puedeEditar ? (
				<PermissionGuard
					allowedPermissions={['ADMINISTRAR_PROCESOS_COMERCIALES_PROPIOS']}
					fallback={
						<p className='mt-0.5 text-sm font-medium tabular-nums text-foreground'>
							{proceso.fecha_estimada_cierre
								? formatFechaCorta(proceso.fecha_estimada_cierre)
								: '—'}
						</p>
					}
				>
					<div className='mt-0.5 flex items-center gap-1.5'>
						<Input
							type='date'
							name='fecha'
							value={fecha}
							onChange={event => cambiarFecha(event.target.value)}
							className={INPUT_FANTASMA}
							aria-label='Fecha estimada de cierre'
						/>

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
					{proceso.fecha_estimada_cierre
						? formatFechaCorta(proceso.fecha_estimada_cierre)
						: '—'}
				</p>
			)}
		</div>
	)
}
