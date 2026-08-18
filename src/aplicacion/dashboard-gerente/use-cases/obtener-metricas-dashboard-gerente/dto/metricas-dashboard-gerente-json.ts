export interface MetricasDashboardGerenteJson {
	produccion: {
		mes_actual: {
			total_prima_neta: number
			variacion_mes_anterior: number
			mes_label: string
		}
		comision_mes_actual: ComisionMesActual
		tendencia_12_meses: TendenciaMes[]
		por_compania: ItemValor[]
		por_ejecutivo: ItemValor[]
		por_ramo: ItemValor[]
		compania_top: {
			nombre: string
			prima_neta: number
		}
	}
	actividades_comerciales: {
		por_tipo: ActividadTipo[]
		resumen: ResumenActividades
	}
	reportes_polizas: {
		por_comuna: ItemCantidad[]
		por_sexo: ItemCantidad[]
		por_rango_edad: ItemCantidad[]
		por_ramo: ItemCantidad[]
	}
	evaluacion_proyectos: {
		kpis: KpisEvaluacion
		por_compania: ItemCantidad[]
		por_ramo: ItemCantidad[]
	}
}

export interface ComisionMesActual {
	total_comision: number
	mes_label: string
}

export interface TendenciaMes {
	mes: string
	prima_neta: number
}

export interface ItemValor {
	nombre: string
	valor: number
}

export interface ItemCantidad {
	nombre: string
	cantidad: number
}

export interface ActividadTipo {
	tipo: string
	concretadas: number
	pendientes: number
}

export interface ResumenActividades {
	agendadas: number
	concretadas: number
	pendientes: number
	porcentaje_cumplimiento: number
}

export interface KpisEvaluacion {
	total_proyectos: number
	monto_total_uf: number
	tasa_conversion: number
}
