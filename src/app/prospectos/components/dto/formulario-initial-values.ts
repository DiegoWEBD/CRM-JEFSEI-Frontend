export interface FormularioInitialValues {
	rut_riesgo: string | null
	nombre_riesgo: string
	nombre_contacto: string
	telefono_contacto: string
	correo_contacto: string | null
	direccion: string
	id_comuna: number
	observaciones: string | null
	id_linea_negocio: number
	cargo_contacto: string | null
	tiene_locales_comerciales: '' | 'Sí' | 'No' | null
	uso_del_condominio: string | null
	numero_pisos: number | null
	numero_torres: number | null
	cantidad_departamentos: number | null
	cantidad_subterraneos: number | null
	tiene_piscina: '' | 'Sí' | 'No' | null
	year_construccion: number | null
	metros_cuadrados: number | null
	desea_ser_contactado: '' | 'Sí' | 'No' | null
}
