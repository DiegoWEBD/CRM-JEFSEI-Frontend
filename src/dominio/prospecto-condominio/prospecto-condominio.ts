import EvaluacionRiesgo from '../evaluacion-riesgo/evaluacion-riesgo'
import { Prospecto } from '../prospecto/prospecto'

export interface ProspectoCondominio extends Prospecto {
	evaluacion_riesgo?: EvaluacionRiesgo
	cargo_contacto?: string
	tiene_locales_comerciales?: boolean
	uso_del_condominio?: string
	numero_pisos?: number
	numero_torres?: number
	cantidad_departamentos?: number
	cantidad_subterraneos?: number
	tiene_piscina?: boolean
	year_construccion?: number
	metros_cuadrados?: number
	desea_ser_contactado?: boolean
	informacion_completa: boolean
}
