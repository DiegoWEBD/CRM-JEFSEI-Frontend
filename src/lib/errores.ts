export class UnauthorizedError extends Error {
	constructor(mensaje = 'No tienes permiso para acceder a este recurso.') {
		super(mensaje)
		this.name = 'UnauthorizedError'
	}
}
