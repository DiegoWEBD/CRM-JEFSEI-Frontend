import AdministradorCondominio from '../administrador-condominio/administrador-condominio'
import { Prospecto } from '../prospecto/prospecto'

export interface ProspectoCondominio extends Prospecto {
	administrador?: AdministradorCondominio
	uf_por_metro_cuadrado?: number
	porcentaje_depreciacion?: number
	porcentaje_espacios_comunes?: number
	tiene_locales_comerciales?: boolean
	uso_del_condominio?: string
	materialidad?: string
	clasificacion_preliminar_incendio?: string
	procesos_productivos?: boolean
	numero_pisos?: number
	numero_torres?: number
	cantidad_departamentos?: number
	cantidad_subterraneos?: number
	tiene_piscina?: boolean
	ubicacion_piscina?: string
	tiene_alarma_incencio?: boolean
	tiene_sprinklers?: boolean
	year_construccion?: number
	metros_cuadrados?: number
}
