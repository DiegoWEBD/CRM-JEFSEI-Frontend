import Rol from '../rol/rol'

export default class Usuario {
	constructor(
		public rut: string,
		public nombre: string,
		public correo: string,
		public telefono: string,
		public sucursal: string,
		public roles: Rol[],
	) {}
}
