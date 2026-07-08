import Rol from '../rol/rol'

export default class Usuario {
	constructor(
		public rut: string,
		public nombre: string,
		public correo: string | null,
		public telefono: string | null,
		public sucursal: string,
		public roles: Rol[],
		public meta_mensual_uf: number | null = null,
		public porcentaje_comision: number | null = null,
		public fecha_registro: string = '',
		public habilitado: boolean = true,
		public eliminado: boolean = false,
	) {}
}
