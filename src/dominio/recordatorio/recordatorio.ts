import {
	SharedReminderPriority,
	SharedReminderStatus,
	SharedReminderType,
} from '@/types/shared/shared-reminders'

export default class Recordatorio {
	constructor(
		public id: number,
		public id_prospecto: number | null,
		public nombre_prospecto: string | null,
		public titulo: string,
		public detalle: string | null,
		public completado: boolean,
		public prioridad: SharedReminderPriority,
		public tipo_gestion: SharedReminderType,
		public fecha_recordatorio: string,
		public estado: SharedReminderStatus,
	) {}
}
