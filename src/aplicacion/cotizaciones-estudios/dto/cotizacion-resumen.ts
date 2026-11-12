import type { EstadoCotizacionBackend } from '@/dominio/cotizacion/cotizacion'

/**
 * Resumen de una cotización tal como viene embebido en cada fila del panel
 * (`GET /solicitudes-cotizacion/panel-estudios`). Sin archivo adjunto: el PDF
 * lo trae el diálogo "Ver cotizaciones" con su fetch diferido.
 */
export interface CotizacionResumen {
	id: number
	company: string
	prima_neta: number
	prima_bruta: number
	fecha_vencimiento: string
	estado: EstadoCotizacionBackend
}
