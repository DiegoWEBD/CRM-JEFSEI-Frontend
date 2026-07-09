export type ColumnaCobranza =
	| 'proximos10'
	| 'llamarHoy'
	| 'atrasados'
	| 'sinPlanPago'
	| 'morosos'
	| 'pagados'

export interface CuotaDashboard {
	id: number
	numero_cuota: number
	fecha_vencimiento: string
	pagado: boolean
	fecha_pago: string | null
	numero_poliza: string
	nombre_cliente: string
	id_prospecto: number
	estado: string
	producto: string
	total_cuotas: number
	telefono_contacto: string | null
	rut_riesgo: string | null
}

export interface PolizaSinPlanPago {
	numero_poliza: string
	id_prospecto: number
	nombre_cliente: string
	producto: string
	compania: string
	cancelada: boolean
	telefono_contacto: string | null
	rut_riesgo: string | null
}

export interface DashboardCobranza {
	kpis: Record<ColumnaCobranza, number>
	pagados: CuotaDashboard[]
	morosos: CuotaDashboard[]
	atrasados: CuotaDashboard[]
	sin_plan_pago: PolizaSinPlanPago[]
	llamar_hoy: CuotaDashboard[]
	proximos10: CuotaDashboard[]
}
