export default class Sesion {
	constructor(
		public id: string,
		public rut_usuario: string,
		public nombre_usuario: string | null,
		public ip: string | null,
		public user_agent: string | null,
		public dispositivo: string | null,
		public creado_en: string,
		public ultimo_acceso: string | null,
		public duracion_minutos: number | null,
		public esta_activa: boolean,
		public revocado_en: string | null,
		public motivo_revocacion: string | null,
	) {}
}