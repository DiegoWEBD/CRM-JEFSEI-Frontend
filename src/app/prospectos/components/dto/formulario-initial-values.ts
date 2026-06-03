export interface FormularioInitialValues {
	rut_riesgo?: string
	nombre_riesgo: string
	nombre_contacto: string
	telefono_contacto: string
	correo_contacto?: string
	direccion: string
	region: string
	comuna: string
	observaciones?: string
	id_linea_negocio: number
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
}
