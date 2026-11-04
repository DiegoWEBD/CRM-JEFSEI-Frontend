export interface ActualizarProspectoEmpresaRequest {
	rut_riesgo: string | null
	nombre_riesgo: string
	telefono_contacto: string | null
	correo_contacto: string | null
	direccion: string | null
	region: string | null
	comuna: string | null
	observaciones: string | null
	nombre_fantasia: string | null
	cantidad_trabajadores: number | null
	giros_comerciales: string[]
}
