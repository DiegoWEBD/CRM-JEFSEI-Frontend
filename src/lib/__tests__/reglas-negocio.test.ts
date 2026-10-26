import { describe, expect, it } from 'vitest'

import {
	estadoCotizacionPerfilDesdeSolicitud,
	type EstadoSolicitudCotizacionPerfil,
} from '@/lib/estados-cotizaciones'
import { clasificacionPreliminarDesdeMaterialidad } from '@/lib/materialidades'
import {
	labelUbicacionPiscinaCondominio,
	ubicacionPiscinaSegunTienePiscina,
	ubicacionPiscinaValidaSiTienePiscina,
	type UbicacionPiscinaCondominio,
} from '@/lib/ubicacion.piscina'
import {
	comunaCoincideConRegion,
	normalizarNombreRegion,
	obtenerComunasDeRegion,
	sanitizarRegionYComuna,
} from '@/lib/chile-regiones-comunas'

describe('estadoCotizacionPerfilDesdeSolicitud — qué se muestra como cotización generada', () => {
	it('marca como generada la cotización cuando ya hay estudio o se ganó', () => {
		for (const estado of [
			'estudio_disponible',
			'estudio_enviado_cliente',
			'ganado',
		] as EstadoSolicitudCotizacionPerfil[]) {
			expect(estadoCotizacionPerfilDesdeSolicitud(estado)).toBe('cotizacion_generada')
		}
	})

	it('mantiene como nueva solicitud los estados previos y los cierres perdidos', () => {
		for (const estado of [
			'sin_cotizacion_solicitada',
			'solicitud_registrada',
			'recotizacion_solicitada',
			'perdido',
		] as EstadoSolicitudCotizacionPerfil[]) {
			expect(estadoCotizacionPerfilDesdeSolicitud(estado)).toBe('nueva_solicitud')
		}
	})
})

describe('clasificacionPreliminarDesdeMaterialidad — clasificación de incendio', () => {
	it('clasifica cada materialidad según la tabla de riesgo', () => {
		expect(clasificacionPreliminarDesdeMaterialidad('hormigon_armado')).toBe('incombustible')
		expect(clasificacionPreliminarDesdeMaterialidad('albanileria_reforzada')).toBe(
			'incombustible',
		)
		expect(clasificacionPreliminarDesdeMaterialidad('albanileria_no_reforzada')).toBe(
			'requiere_revision',
		)
		expect(clasificacionPreliminarDesdeMaterialidad('madera')).toBe('combustible')
	})

	it('sin materialidad no emite una clasificación', () => {
		expect(clasificacionPreliminarDesdeMaterialidad('')).toBe('')
	})
})

describe('ubicacionPiscinaSegunTienePiscina — coherencia del formulario de condominio', () => {
	it('sin piscina la ubicación se normaliza a no_aplica', () => {
		for (const ubicacion of [
			'primer_piso',
			'entre_piso',
			'azotea',
			'subterraneo',
			'',
		] as (UbicacionPiscinaCondominio | '')[]) {
			expect(ubicacionPiscinaSegunTienePiscina(false, ubicacion)).toBe('no_aplica')
		}
	})

	it('con piscina se conserva la ubicación elegida', () => {
		expect(ubicacionPiscinaSegunTienePiscina(true, 'azotea')).toBe('azotea')
	})

	it('con piscina se descarta un no_aplica heredado del estado anterior', () => {
		expect(ubicacionPiscinaSegunTienePiscina(true, 'no_aplica')).toBe('')
	})

	it('solo admite las ubicaciones válidas cuando hay piscina', () => {
		expect(ubicacionPiscinaValidaSiTienePiscina('primer_piso')).toBe(true)
		expect(ubicacionPiscinaValidaSiTienePiscina('no_aplica')).toBe(false)
		expect(ubicacionPiscinaValidaSiTienePiscina('azotea?')).toBe(false)
	})

	it('etiqueta las ubicaciones conocidas y no inventa etiquetas para el resto', () => {
		expect(labelUbicacionPiscinaCondominio('azotea')).toBe('Azotea')
		expect(labelUbicacionPiscinaCondominio('')).toBe('—')
		expect(labelUbicacionPiscinaCondominio('valor-desconocido')).toBe('valor-desconocido')
	})
})

describe('chile-regiones-comunas — consistencia de la ubicación del riesgo', () => {
	const REGION = 'Región Metropolitana de Santiago'

	it('resuelve los alias históricos al nombre oficial de la región', () => {
		expect(normalizarNombreRegion('Región Metropolitana')).toBe(REGION)
		expect(normalizarNombreRegion('  Región Metropolitana  ')).toBe(REGION)
	})

	it('rechaza regiones que no existen', () => {
		expect(normalizarNombreRegion('Región de Narnia')).toBeNull()
		expect(normalizarNombreRegion('')).toBeNull()
		expect(normalizarNombreRegion('   ')).toBeNull()
	})

	it('descarta una comuna que no pertenece a la región declarada', () => {
		expect(comunaCoincideConRegion(REGION, 'Providencia')).toBe(true)
		expect(comunaCoincideConRegion(REGION, 'Valdivia')).toBe(false)
		expect(comunaCoincideConRegion(REGION, '   ')).toBe(false)
	})

	it('al sanitizar, una región inválida vacía también la comuna', () => {
		expect(sanitizarRegionYComuna('Región de Narnia', 'Providencia')).toEqual({
			region: '',
			comuna: '',
		})
	})

	it('al sanitizar, una comuna ajena a la región se elimina pero la región se conserva', () => {
		expect(sanitizarRegionYComuna(REGION, 'Valdivia')).toEqual({
			region: REGION,
			comuna: '',
		})
	})

	it('al sanitizar conserva el par válido', () => {
		expect(sanitizarRegionYComuna('Región Metropolitana', 'Providencia')).toEqual({
			region: REGION,
			comuna: 'Providencia',
		})
	})

	it('devuelve comunas únicamente de la región resuelta', () => {
		expect(obtenerComunasDeRegion('Región inexistente')).toEqual([])
		expect(obtenerComunasDeRegion(REGION).length).toBeGreaterThan(0)
	})
})
