import { describe, expect, it } from 'vitest'

import {
	buildCamposFechaSolicitud,
	fechaCalendarioDesdeIso,
	formatCreatedAtSolicitudCotizacionPerfil,
	formatFechaSolicitudConHora,
	getFechaSolicitudIso,
} from '@/lib/format-fecha-solicitud'
import { diaDeSantiago, formatearFecha } from '@/utils/formatear-fecha'
import { formatFechaCorta } from '@/utils/format-fecha-corta'

/**
 * Varias de estas funciones parsean `yyyy-MM-dd` a mano para evitar el corrimiento
 * de un día que produce `new Date('2026-01-15')` (medianoche UTC) en zonas UTC
 * negativas, como America/Santiago. Los casos comparan contra una fecha
 * construida localmente: si alguien vuelve a `new Date(iso)`, el test falla.
 */
describe('fechas yyyy-MM-dd — sin corrimiento de día', () => {
	const LOCAL_15_ENERO = new Date(2026, 0, 15)

	it('formatearFecha no corre el día de una fecha calendario', () => {
		expect(formatearFecha('2026-01-15', 'dd-MM-yyyy')).toBe(
			formatearFecha(LOCAL_15_ENERO, 'dd-MM-yyyy'),
		)
		expect(formatearFecha('2026-01-15', 'dd-MM-yyyy')).toBe('15-01-2026')
	})

	it('formatFechaCorta no corre el día de una fecha calendario', () => {
		expect(formatFechaCorta('2026-01-15')).toBe(
			LOCAL_15_ENERO.toLocaleDateString('es-CL', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			}),
		)
	})

	it('una fecha con hora explícita se toma como local, sin recalcularla', () => {
		expect(formatearFecha('2026-01-15T09:30:00', 'dd-MM-yyyy HH:mm')).toBe(
			'15-01-2026 09:30',
		)
	})
})

describe('getFechaSolicitudIso — normalización de la fecha de solicitud', () => {
	it('prefiere la fecha ISO completa cuando ya viene armada', () => {
		expect(
			getFechaSolicitudIso({
				fechaSolicitud: '2026-01-15',
				fechaSolicitudIso: '2026-01-15T09:00:00.000Z',
			}),
		).toBe('2026-01-15T09:00:00.000Z')
	})

	it('respeta un valor que ya trae hora', () => {
		expect(
			getFechaSolicitudIso({ fechaSolicitud: '2026-01-15T18:45:00' }),
		).toBe('2026-01-15T18:45:00')
	})

	it('completa una fecha de solo día con una hora fija, sin dejarla ambigua', () => {
		expect(getFechaSolicitudIso({ fechaSolicitud: ' 2026-01-15 ' })).toBe(
			'2026-01-15T09:00:00.000Z',
		)
	})

	it('extrae la parte calendario de una ISO', () => {
		expect(fechaCalendarioDesdeIso('2026-01-15T09:00:00.000Z')).toBe('2026-01-15')
	})
})

describe('buildCamposFechaSolicitud — lo que se persiste', () => {
	it('separa el día calendario de la fecha-hora completa', () => {
		const campos = buildCamposFechaSolicitud('2026-01-15T12:00:00.000Z')

		expect(campos.fechaSolicitud).toBe('2026-01-15')
		expect(campos.fechaSolicitudIso).toBe('2026-01-15T12:00:00.000Z')
	})
})

describe('formatCreatedAtSolicitudCotizacionPerfil — presentación en el perfil', () => {
	it('devuelve null cuando no hay fecha válida', () => {
		expect(formatCreatedAtSolicitudCotizacionPerfil(undefined)).toBeNull()
		expect(formatCreatedAtSolicitudCotizacionPerfil(null)).toBeNull()
		expect(formatCreatedAtSolicitudCotizacionPerfil('   ')).toBeNull()
		expect(formatCreatedAtSolicitudCotizacionPerfil('no-es-fecha')).toBeNull()
	})

	it('compone fecha y hora a partir de la ISO recibida', () => {
		const resultado = formatCreatedAtSolicitudCotizacionPerfil('2026-01-15T14:30:00')

		expect(resultado).toContain('15-01-2026')
		expect(resultado).toContain('14:30')
	})

	it('una fecha de solo día se interpreta al mediodía para no correr el día', () => {
		const resultado = formatCreatedAtSolicitudCotizacionPerfil('2026-01-15')

		expect(resultado).toContain('15-01-2026')
	})
})

describe('formatFechaSolicitudConHora — etiqueta de la fila', () => {
	it('indica la fecha y la hora de la solicitud', () => {
		const resultado = formatFechaSolicitudConHora({ fechaSolicitud: '2026-01-15T09:15:00' })

		expect(resultado.fecha).toContain('2026')
		expect(resultado.hora).toBe('09:15 hrs')
		expect(resultado.linea).toContain('09:15 hrs')
	})
})

describe('diaDeSantiago — día calendario de America/Santiago', () => {
	it('no corre el día cuando el instante está dentro del día de Santiago', () => {
		expect(diaDeSantiago('2026-08-29T12:00:00Z')).toBe('2026-08-29')
	})

	it('devuelve el día de Santiago aunque el ISO caiga en el día UTC siguiente', () => {
		// Regresión: 2026-08-30 00:00+00 es el 29-08 a las 20:00 en Santiago;
		// tomar la parte antes de 'T' mostraba el 30 en el formulario.
		expect(diaDeSantiago('2026-08-30T00:00:00+00:00')).toBe('2026-08-29')
	})

	it('resuelve medianoche de Santiago con el desfase de horario de invierno', () => {
		// Medianoche de Santiago en invierno es UTC-4 (04:00Z).
		expect(diaDeSantiago('2026-08-29T04:00:00+00:00')).toBe('2026-08-29')
	})
})
