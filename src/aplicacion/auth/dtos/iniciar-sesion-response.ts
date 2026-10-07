import Usuario from '@/dominio/usuario/usuario'

export type IniciarSesionResponse = {
	access_token: string
	refresh_token: string
	token_type: string
	expire_minutes: number
	usuario: Usuario
}
