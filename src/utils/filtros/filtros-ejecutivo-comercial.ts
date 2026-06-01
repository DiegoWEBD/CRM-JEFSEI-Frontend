export type KpiPanelDetalleKey = 'activos' | 'asignados' | 'cotiz' | 'estDisp'

export const KPI_PANEL_TITULOS: Record<KpiPanelDetalleKey, string> = {
	activos: 'Clientes activos',
	asignados: 'Clientes asignados',
	cotiz: 'Cotizaciones solicitadas',
	estDisp: 'Estudios disponibles',
}

export type EstudioDisponiblePanelRow = {
	solicitudId: string
	clienteId: string
	clienteNombre: string
	lineaSeguro: string
}
