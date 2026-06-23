export type MaterialidadPrincipalCondominio =
	| 'hormigon_armado'
	| 'albanileria_reforzada'
	| 'albanileria_no_reforzada'
	| 'madera'

export type ClasificacionPreliminarIncendio =
	| 'incombustible'
	| 'requiere_revision'
	| 'combustible'

export const MATERIALIDAD_PRINCIPAL_LABELS: Record<
	MaterialidadPrincipalCondominio,
	string
> = {
	hormigon_armado: 'Hormigón armado',
	albanileria_reforzada: 'Albañilería reforzada',
	albanileria_no_reforzada: 'Albañilería no reforzada',
	madera: 'Madera',
}

export const CLASIFICACION_PRELIMINAR_INCENDIO_LABELS: Record<
	ClasificacionPreliminarIncendio,
	string
> = {
	incombustible: 'Incombustible',
	requiere_revision: 'Requiere revisión',
	combustible: 'Combustible',
}

const CLASIFICACION_POR_MATERIALIDAD: Record<
	MaterialidadPrincipalCondominio,
	ClasificacionPreliminarIncendio
> = {
	hormigon_armado: 'incombustible',
	albanileria_reforzada: 'incombustible',
	albanileria_no_reforzada: 'requiere_revision',
	madera: 'combustible',
}

export function clasificacionPreliminarDesdeMaterialidad(
	materialidad: MaterialidadPrincipalCondominio | '',
): ClasificacionPreliminarIncendio | '' {
	if (!materialidad) return ''
	return CLASIFICACION_POR_MATERIALIDAD[materialidad]
}
