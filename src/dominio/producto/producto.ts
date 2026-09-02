export default class Producto {
	constructor(
		public id: number,
		public nombre: string,
		public id_linea_negocio: number,
		public codigo: string | null,
		public eliminado: boolean,
	) {}
}
