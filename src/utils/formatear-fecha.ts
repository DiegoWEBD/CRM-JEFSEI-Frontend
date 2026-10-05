import { format, parse } from 'date-fns'
import { es } from 'date-fns/locale'

const SOLO_FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/

export const formatearFecha = (fecha: Date | string, formato: string) => {
	let fechaDate: Date
	if (fecha instanceof Date) {
		fechaDate = fecha
	} else if (SOLO_FECHA_REGEX.test(fecha)) {
		// 'yyyy-MM-dd' (p. ej. de <input type='date'>) lo parsea new Date() como
		// medianoche UTC y, al formatear en hora local, corre un día hacia atrás
		// en zonas UTC negativas. parse() lo interpreta como fecha local.
		fechaDate = parse(fecha, 'yyyy-MM-dd', new Date())
	} else {
		fechaDate = new Date(fecha)
	}
	return format(fechaDate, formato, {
		locale: es,
	})
}
