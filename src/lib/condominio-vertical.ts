export type TipoCondominio = 'vertical' | 'horizontal'

export const TIPO_CONDOMINIO_OPCIONES: TipoCondominio[] = [
	'vertical',
	'horizontal',
]

export const TIPO_CONDOMINIO_LABELS: Record<TipoCondominio, string> = {
	vertical: 'Vertical (Departamentos)',
	horizontal: 'Horizontal (Casas)',
}

export function labelTipoCondominio(
	vertical: boolean | null | undefined,
): string {
	if (vertical === true) return TIPO_CONDOMINIO_LABELS.vertical
	if (vertical === false) return TIPO_CONDOMINIO_LABELS.horizontal
	return '—'
}

export function tipoCondominioDesdeVertical(
	vertical: boolean | null | undefined,
): TipoCondominio | '' {
	if (vertical === true) return 'vertical'
	if (vertical === false) return 'horizontal'
	return ''
}

export function verticalDesdeTipoCondominio(
	tipo: string | null | undefined,
): boolean | null {
	if (tipo === 'vertical') return true
	if (tipo === 'horizontal') return false
	return null
}
