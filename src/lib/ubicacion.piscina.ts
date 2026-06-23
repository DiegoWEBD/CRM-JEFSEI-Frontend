export type UbicacionPiscinaCondominio =
	| 'primer_piso'
	| 'entre_piso'
	| 'azotea'
	| 'subterraneo'
	| 'no_aplica'

export const UBICACION_PISCINA_OPCIONES_CON_PISCINA: UbicacionPiscinaCondominio[] =
	['primer_piso', 'entre_piso', 'azotea', 'subterraneo']

export const UBICACION_PISCINA_LABELS: Record<
	UbicacionPiscinaCondominio,
	string
> = {
	primer_piso: 'Primer piso',
	entre_piso: 'Entre piso',
	azotea: 'Azotea',
	subterraneo: 'Subterráneo',
	no_aplica: 'No aplica',
}

export function labelUbicacionPiscinaCondominio(
	v: UbicacionPiscinaCondominio | '' | string,
): string {
	if (!v) return '—'
	if (v in UBICACION_PISCINA_LABELS) {
		return UBICACION_PISCINA_LABELS[v as UbicacionPiscinaCondominio]
	}
	return v.trim() || '—'
}

export function ubicacionPiscinaSegunTienePiscina(
	tienePiscina: boolean,
	ubicacion: UbicacionPiscinaCondominio | '',
): UbicacionPiscinaCondominio | '' {
	if (!tienePiscina) return 'no_aplica'
	if (ubicacion === 'no_aplica') return ''
	return ubicacion
}

export function ubicacionPiscinaValidaSiTienePiscina(
	ubicacion: string,
): boolean {
	return (UBICACION_PISCINA_OPCIONES_CON_PISCINA as readonly string[]).includes(
		ubicacion,
	)
}
