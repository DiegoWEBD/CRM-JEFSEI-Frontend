import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatearFecha = (fecha: Date, formato: string) => {
	return format(fecha, formato, {
		locale: es,
	})
}
