export default class RegistroAuditoria {
	constructor(
		public id: number,
		public fecha_registro: string,
		public categoria: string,
		public evento: string,
		public resultado: string,
		public estado_http: number | null,
		public rut_usuario: string | null,
		public nombre_usuario: string | null,
		public ip_origen: string,
		public user_agent: string | null,
		public id_peticion: string | null,
		public metodo: string | null,
		public ruta: string | null,
		public entidad_tipo: string | null,
		public entidad_id: string | null,
		public detalle: string | null,
		public duracion_ms: number | null,
	) {}
}
