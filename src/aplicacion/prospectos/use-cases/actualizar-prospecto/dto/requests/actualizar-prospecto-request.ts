export interface ActualizarProspectoRequest {
	rut_riesgo: string | null
	nombre_riesgo: string
	telefono_contacto: string | null
	correo_contacto: string | null
	direccion: string | null
	region: string | null
	comuna: string | null
	observaciones: string | null
}
