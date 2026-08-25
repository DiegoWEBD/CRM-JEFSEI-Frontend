import {
	ClasificacionPreliminarIncendio,
	MaterialidadPrincipalCondominio,
} from '@/lib/materialidades'
import AdministradorCondominio from '../administrador-condominio/administrador-condominio'
import { Prospecto } from '../prospecto/prospecto'
import { UbicacionPiscinaCondominio } from '@/lib/ubicacion.piscina'

export interface ProspectoCondominio extends Prospecto {
	administrador?: AdministradorCondominio
	uf_por_metro_cuadrado?: number
	valor_uf_m2_disponible?: boolean
	porcentaje_depreciacion?: number
	porcentaje_espacios_comunes?: number
	tiene_locales_comerciales?: boolean
	uso_del_condominio?: string
	materialidad?: MaterialidadPrincipalCondominio
	clasificacion_preliminar_incendio?: ClasificacionPreliminarIncendio
	procesos_productivos?: boolean
	numero_pisos?: number
	numero_torres?: number
	cantidad_departamentos?: number
	cantidad_subterraneos?: number
	tiene_piscina?: boolean
	ubicacion_piscina?: UbicacionPiscinaCondominio
	tiene_alarma_incendio?: boolean
	tiene_sprinklers?: boolean
	year_construccion?: number
	metros_cuadrados?: number
}
