export type MotivoRecotizacionLinea =
	| 'menor_prima'
	| 'mayor_cobertura'
	| 'otra_compania'
	| 'ajuste_condiciones'
	| 'revision_cliente'

export const MOTIVOS_RECOTIZACION_LINEA: MotivoRecotizacionLinea[] = [
	'menor_prima',
	'mayor_cobertura',
	'otra_compania',
	'ajuste_condiciones',
	'revision_cliente',
]

export const MOTIVO_RECOTIZACION_LABELS: Record<
	MotivoRecotizacionLinea,
	string
> = {
	menor_prima: 'Cliente solicita menor prima',
	mayor_cobertura: 'Cliente solicita mayor cobertura',
	otra_compania: 'Cliente solicita otra compañía',
	ajuste_condiciones: 'Ajuste de condiciones',
	revision_cliente: 'Revisión solicitada por cliente',
}

export type MotivoCierrePerdidoLinea =
	| 'no_acepta_precio'
	| 'otra_corredora'
	| 'no_responde'
	| 'no_cumple_condiciones'
	| 'sin_continuidad'

export const MOTIVOS_CIERRE_PERDIDO_LINEA: MotivoCierrePerdidoLinea[] = [
	'no_acepta_precio',
	'otra_corredora',
	'no_responde',
	'no_cumple_condiciones',
	'sin_continuidad',
]

export const MOTIVO_CIERRE_PERDIDO_LABELS: Record<
	MotivoCierrePerdidoLinea,
	string
> = {
	no_acepta_precio: 'Cliente no acepta precio',
	otra_corredora: 'Cliente contrató con otra corredora',
	no_responde: 'Cliente no responde',
	no_cumple_condiciones: 'No cumple condiciones',
	sin_continuidad: 'Sin continuidad comercial',
}
