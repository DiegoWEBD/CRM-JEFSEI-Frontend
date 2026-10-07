export type TokenPayload = {
	rut: string
	nombre: string
	exp: number
	sid?: string
	jti?: string
	codigo_roles: string[]
	nombre_roles: string[]
	codigo_permisos: string[]
}
