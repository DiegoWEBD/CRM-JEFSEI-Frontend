export default class ComunicadoGerencia {
	constructor(
		public id: number,
		public titulo: string,
		public descripcion: string,
		public fecha: string,
		public prioridad: string,
		public caducidad: string,
		public nombre_gerente: string,
	) {}
}
