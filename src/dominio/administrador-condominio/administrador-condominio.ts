export default interface AdministradorCondominio {
	id: number
	nombre_administrador: string
	nombre_contacto?: string
	telefono?: string
	correo?: string
	cantidad_condominios: number
}
