export interface ActualizarContactoRequest {
	nombre: string
	telefono?: string | null
	correo?: string | null
	cargo?: string | null
}