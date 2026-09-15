import type { EstadoCotizacionBackend } from '@/dominio/cotizacion/cotizacion'
import type { Prioridad } from '@/types/prioridad/prioridad'

export interface PanelEstudioFila {
	id: number
	id_prospecto: number
	cliente: string
	linea_seguro: string
	ejecutivo_comercial: string
	prioridad: Prioridad
	cantidad_cotizaciones: number
	fecha: string
	vencimiento_mas_proximo: string | null
	estado: EstadoCotizacionBackend | null
	tiene_estudio: boolean
	id_estudio: number | null
}
