import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'
import type { EstadoSolicitudBandeja } from './badge-estado-solicitud'

/**
 * Estado informativo que se muestra en el badge de cada fila.
 *
 * Los estados no son excluyentes (una solicitud puede tener cotizaciones y
 * estudio); el badge muestra el más avanzado por precedencia.
 */
export function resolverEstadoBandeja(
	s: SolicitudCotizacionResumen,
): EstadoSolicitudBandeja {
	if (!s.informacion_completa) return 'informacion_incompleta'
	if (s.estudio_disponible) return 'estudio_emitido'
	if (s.tiene_cotizaciones) return 'con_cotizaciones'
	return 'lista_para_cotizar'
}
