import Usuario from '@/dominio/usuario/usuario'

export type IniciarSesionResponse = {
	access_token: string
	token_type: string
	usuario: Usuario
}
