'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, DollarSign, ExternalLink, Phone } from 'lucide-react'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import { CuotaDashboard, PolizaSinPlanPago } from '@/dominio/cobranza/dashboard-cobranza'
import { cn } from '@/lib/utils'
import { formatRut } from '@/utils/format-rut'

type ItemCobranzaProps = {
	item: CuotaDashboard | PolizaSinPlanPago
	onRegistrarPago?: (cuota: CuotaDashboard) => void
}

const ESTADO_BADGE: Record<string, { variant: 'success' | 'warning' | 'destructive' | 'info' | 'purple'; label: string }> = {
	pagado: { variant: 'success', label: 'Pagado' },
	moroso: { variant: 'destructive', label: 'Moroso' },
	atrasado: { variant: 'warning', label: 'Atrasado' },
	llamarHoy: { variant: 'info', label: 'Llamar hoy' },
	proximos10: { variant: 'purple', label: 'Próximos 10 días' },
}

export default function ItemCobranza({ item, onRegistrarPago }: ItemCobranzaProps) {
	const [expandida, setExpandida] = useState(false)
	const esCuota = 'numero_cuota' in item

	if (esCuota) {
		return (
			<TarjetaCuota
				cuota={item as CuotaDashboard}
				expandida={expandida}
				onToggle={() => setExpandida(v => !v)}
				onRegistrarPago={onRegistrarPago}
			/>
		)
	}

	return (
		<TarjetaPoliza
			poliza={item as PolizaSinPlanPago}
			expandida={expandida}
			onToggle={() => setExpandida(v => !v)}
		/>
	)
}

type TarjetaCuotaProps = {
	cuota: CuotaDashboard
	expandida: boolean
	onToggle: () => void
	onRegistrarPago?: (cuota: CuotaDashboard) => void
}

function TarjetaCuota({ cuota, expandida, onToggle, onRegistrarPago }: TarjetaCuotaProps) {
	const badgeConf = ESTADO_BADGE[cuota.estado] ?? { variant: 'outline' as const, label: cuota.estado }

	return (
		<Card className="border-border/60 shadow-none transition-colors">
			<CardContent className={cn(expandida ? 'p-2.5' : 'p-2')}>
				<div className="flex items-start justify-between gap-1">
					<div className="min-w-0 flex-1">
						<Link
							href={`/prospectos/${cuota.id_prospecto}`}
							className="inline-flex items-center gap-1 text-sm font-semibold leading-snug text-primary underline-offset-2 hover:underline"
						>
							<span className="truncate">{cuota.nombre_cliente}</span>
							<ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />
						</Link>
						{cuota.rut_riesgo && (
							<p className="mt-0.5 text-xs leading-snug text-muted-foreground">
								{formatRut(cuota.rut_riesgo)}
							</p>
						)}
					</div>
					<Badge variant={badgeConf.variant} className="h-5 shrink-0 px-1.5 text-xs font-medium leading-none">
						{badgeConf.label}
					</Badge>
				</div>

				<div className="mt-1.5">
					<Link
						href={`/polizas/${cuota.numero_poliza}`}
						className="truncate font-mono text-xs font-medium text-primary underline-offset-2 hover:underline"
					>
						{cuota.numero_poliza}
					</Link>
				</div>

				{expandida && (
					<>
						{cuota.telefono_contacto && (
							<a
								href={`tel:${cuota.telefono_contacto}`}
								className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								<Phone className="h-3 w-3" aria-hidden />
								<span>{cuota.telefono_contacto}</span>
							</a>
						)}

						<dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-1.5 gap-y-0.5 border-t border-border/60 pt-2 text-xs leading-snug">
							<dt className="text-muted-foreground">Línea</dt>
							<dd className="truncate text-right font-medium text-foreground">
								{cuota.producto}
							</dd>
							<dt className="text-muted-foreground">Póliza</dt>
							<dd className="truncate text-right font-medium text-foreground">
								<Link
									href={`/polizas/${cuota.numero_poliza}`}
									className="text-primary underline-offset-2 hover:underline"
								>
									{cuota.numero_poliza}
								</Link>
							</dd>
							<dt className="text-muted-foreground">Vencimiento</dt>
							<dd className="text-right">
								<span className="font-medium tabular-nums text-foreground">
									{formatearVencimientoRelativo(cuota.fecha_vencimiento)}
								</span>
								<br />
								<span className="text-muted-foreground">
									{formatearFechaCompleta(cuota.fecha_vencimiento)}
								</span>
							</dd>
							<dt className="text-muted-foreground">Cuotas</dt>
							<dd className="text-right font-medium tabular-nums text-foreground">
								{cuota.numero_cuota} de {cuota.total_cuotas}
							</dd>
							{cuota.pagado && cuota.fecha_pago && (
								<>
									<dt className="text-muted-foreground">Pagado el</dt>
									<dd className="text-right font-medium text-emerald-600">
										{formatearFechaCompleta(cuota.fecha_pago)}
									</dd>
								</>
							)}
						</dl>

						<div className="mt-2 flex gap-1.5">
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="h-7 min-w-0 flex-1 px-2 text-sm shadow-none"
								asChild
							>
								<Link href={`/prospectos/${cuota.id_prospecto}`}>Ver perfil</Link>
							</Button>
							{!cuota.pagado && onRegistrarPago && (
								<Button
									type="button"
									size="sm"
									className="h-7 min-w-0 flex-1 px-2 text-sm shadow-none"
									onClick={() => onRegistrarPago(cuota)}
								>
									<DollarSign className="mr-1 h-3 w-3" aria-hidden />
									Registrar pago
								</Button>
							)}
						</div>
					</>
				)}

				<div
					className={cn(
						'flex items-center justify-end',
						expandida ? 'mt-2 border-t border-border/60 pt-2' : 'mt-1',
					)}
				>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-6 gap-0.5 px-1.5 text-xs text-muted-foreground shadow-none hover:text-foreground"
						onClick={onToggle}
					>
						{expandida ? 'Ocultar' : 'Ver más'}
						<ChevronDown
							className={cn('h-3 w-3 shrink-0 transition-transform', expandida && 'rotate-180')}
							aria-hidden
						/>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

type TarjetaPolizaProps = {
	poliza: PolizaSinPlanPago
	expandida: boolean
	onToggle: () => void
}

function TarjetaPoliza({ poliza, expandida, onToggle }: TarjetaPolizaProps) {
	return (
		<Card className="border-border/60 shadow-none transition-colors">
			<CardContent className={cn(expandida ? 'p-2.5' : 'p-2')}>
				<div className="min-w-0">
					<Link
						href={`/prospectos/${poliza.id_prospecto}`}
						className="inline-flex items-center gap-1 text-sm font-semibold leading-snug text-primary underline-offset-2 hover:underline"
					>
						<span className="truncate">{poliza.nombre_cliente}</span>
						<ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />
					</Link>
					{poliza.rut_riesgo && (
						<p className="mt-0.5 text-xs leading-snug text-muted-foreground">
							{formatRut(poliza.rut_riesgo)}
						</p>
					)}
				</div>

				<div className="mt-1.5">
					<Link
						href={`/polizas/${poliza.numero_poliza}`}
						className="truncate font-mono text-xs font-medium text-primary underline-offset-2 hover:underline"
					>
						{poliza.numero_poliza}
					</Link>
				</div>

				{expandida && (
					<>
						{poliza.telefono_contacto && (
							<a
								href={`tel:${poliza.telefono_contacto}`}
								className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								<Phone className="h-3 w-3" aria-hidden />
								<span>{poliza.telefono_contacto}</span>
							</a>
						)}

						<dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-1.5 gap-y-0.5 border-t border-border/60 pt-2 text-xs leading-snug">
							<dt className="text-muted-foreground">Línea</dt>
							<dd className="truncate text-right font-medium text-foreground">
								{poliza.producto}
							</dd>
							<dt className="text-muted-foreground">Póliza</dt>
							<dd className="truncate text-right font-medium text-foreground">
								<Link
									href={`/polizas/${poliza.numero_poliza}`}
									className="text-primary underline-offset-2 hover:underline"
								>
									{poliza.numero_poliza}
								</Link>
							</dd>
							{poliza.compania && (
								<>
									<dt className="text-muted-foreground">Compañía</dt>
									<dd className="truncate text-right font-medium text-foreground">
										{poliza.compania}
									</dd>
								</>
							)}
						</dl>

						<div className="mt-2 flex gap-1.5">
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="h-7 min-w-0 flex-1 px-2 text-sm shadow-none"
								asChild
							>
								<Link href={`/prospectos/${poliza.id_prospecto}`}>Ver perfil</Link>
							</Button>
						</div>
					</>
				)}

				<div className="mt-1.5 flex items-center justify-between gap-1.5">
					<div className="flex items-center gap-1">
						<Badge variant="outline" className="h-5 px-1.5 text-xs font-medium leading-none">
							Sin plan de pago
						</Badge>
						{poliza.cancelada && (
							<Badge variant="destructive" className="h-5 px-1.5 text-xs font-medium leading-none">
								Cancelada
							</Badge>
						)}
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-6 gap-0.5 px-1.5 text-xs text-muted-foreground shadow-none hover:text-foreground"
						onClick={onToggle}
					>
						{expandida ? 'Ocultar' : 'Ver más'}
						<ChevronDown
							className={cn('h-3 w-3 shrink-0 transition-transform', expandida && 'rotate-180')}
							aria-hidden
						/>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

function formatearVencimientoRelativo(fecha: string): string {
	if (!fecha) return '—'
	const ven = new Date(fecha)
	if (isNaN(ven.getTime())) return fecha
	const hoy = new Date()
	hoy.setHours(0, 0, 0, 0)
	ven.setHours(0, 0, 0, 0)
	const diff = Math.round((ven.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
	if (diff < 0) return `Vencido hace ${Math.abs(diff)} días`
	if (diff === 0) return 'Vence hoy'
	if (diff === 1) return 'Vence mañana'
	return `Vence en ${diff} días`
}

function formatearFechaCompleta(fecha: string): string {
	if (!fecha) return '—'
	const d = new Date(fecha)
	if (isNaN(d.getTime())) return fecha
	return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
