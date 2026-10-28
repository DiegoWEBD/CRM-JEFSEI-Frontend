import { format, parse } from 'date-fns'
import { es } from 'date-fns/locale'

const SOLO_FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/

const FORMATO_DIA_SANTIAGO = new Intl.DateTimeFormat('en-CA', {
	timeZone: 'America/Santiago',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
})

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

/**
 * Día calendario (yyyy-MM-dd) de un instante ISO en America/Santiago.
 *
 * Tomar la parte antes de 'T' del ISO entrega el día UTC y corre el día en
 * zonas UTC negativas (p. ej. '2026-08-30T00:00:00Z' es el 29-08 en
 * Santiago). Sirve para llenar `<input type='date'>` con el día de negocio.
 */
export const diaDeSantiago = (fecha: string): string =>
	FORMATO_DIA_SANTIAGO.format(new Date(fecha))
