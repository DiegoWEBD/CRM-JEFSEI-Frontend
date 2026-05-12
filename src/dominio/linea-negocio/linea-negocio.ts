import Producto from '../producto/producto'

export default class LineaNegocio {
	constructor(
		public id: number,
		public nombre: string,
		public productos: Producto[],
	) {}
}
