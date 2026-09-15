import { cookies } from 'next/headers'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'
import Cotizacion from '@/dominio/cotizacion/cotizacion'
import { EstudioComercialCondominioResumen } from '@/aplicacion/estudio-comercial/use-cases/listar-estudios-comerciales/dto/estudio-comercial-condominio-resumen'
import { PanelEstudioFila } from '../../dto/panel-estudio-fila'
import { listarEstudiosComerciales } from '@/aplicacion/estudio-comercial/use-cases/listar-estudios-comerciales/listar-estudios-comerciales'

export const obtenerPanelEstudios = async (): Promise<PanelEstudioFila[]> => {
	const cookieStore = await cookies()
	const cookie = cookieStore.toString()

	const solicitudesResponse = await axiosClient.get('/solicitudes-cotizacion', {
		headers: { Cookie: cookie },
	})
	const solicitudes: SolicitudCotizacionResumen[] =
		solicitudesResponse.data.solicitudes ?? solicitudesResponse.data

	const estudiosPorSolicitud = new Map<
		number,
		EstudioComercialCondominioResumen | null
	>()

	await Promise.all(
		solicitudes.map(async solicitud => {
			try {
				const estudios = await listarEstudiosComerciales(solicitud.id)
				estudiosPorSolicitud.set(
					solicitud.id,
					estudios.length > 0 ? estudios[0] : null,
				)
			} catch {
				estudiosPorSolicitud.set(solicitud.id, null)
			}
		}),
	)

	const solicitudesConCotizaciones = solicitudes.filter(
		s => s.cantidad_cotizaciones > 0,
	)
	const cotizacionesPorSolicitud = new Map<number, Cotizacion[]>()
	await Promise.all(
		solicitudesConCotizaciones.map(async s => {
			try {
				const res = await axiosClient.get(
					`/solicitudes-cotizacion/${s.id}/cotizaciones`,
					{
						headers: { Cookie: cookie },
					},
				)
				cotizacionesPorSolicitud.set(s.id, res.data.cotizaciones ?? [])
			} catch {
				cotizacionesPorSolicitud.set(s.id, [])
			}
		}),
	)

	const filas: PanelEstudioFila[] = solicitudes.map(s => {
		const cotizaciones = cotizacionesPorSolicitud.get(s.id) ?? []
		const cotizacionesConVencimiento = cotizaciones
			.filter(c => c.fecha_vencimiento)
			.sort((a, b) => (a.fecha_vencimiento < b.fecha_vencimiento ? -1 : 1))
		const vencimientoMasProximo =
			cotizacionesConVencimiento.length > 0
				? cotizacionesConVencimiento[0].fecha_vencimiento
				: null
		const estado =
			cotizacionesConVencimiento.length > 0
				? cotizacionesConVencimiento[0].estado
				: null

		const estudio = estudiosPorSolicitud.get(s.id) ?? null

		return {
			id: s.id,
			id_prospecto: s.id_prospecto,
			cliente: s.nombre_riesgo,
			linea_seguro: s.producto,
			ejecutivo_comercial: s.ejecutivo_comercial,
			prioridad: s.prioridad,
			cantidad_cotizaciones: s.cantidad_cotizaciones,
			fecha: s.fecha,
			vencimiento_mas_proximo: vencimientoMasProximo,
			estado,
			tiene_estudio: s.estudio_disponible,
			id_estudio: estudio?.id ?? null,
		}
	})

	return filas
}
