import Rol from '../rol/rol'

export default class Usuario {
	constructor(
		public rut: string,
		public nombre: string,
		public correo: string,
		public telefono: string,
		public sucursal: string,
		public roles: Rol[],
		public meta_mensual_uf: number | null = null,
		public porcentaje_comision: number | null = null,
		public junior: boolean = false,
		public fecha_registro: string = '',
		public habilitado: boolean = true,
		public eliminado: boolean = false,
	) {}
}
