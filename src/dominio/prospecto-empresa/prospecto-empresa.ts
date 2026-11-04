import { Prospecto } from '../prospecto/prospecto'

export interface ProspectoEmpresa extends Prospecto {
	nombre_fantasia?: string
	cantidad_trabajadores?: number
	giros_comerciales: string[]
}
