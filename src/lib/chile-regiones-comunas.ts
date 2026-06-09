/**
 * Regiones y comunas de Chile a partir del dataset @clregions/data (fuente SUBDERE-compatible).
 */

import { clRegions } from '@clregions/data/object'
import type { RegionId } from '@clregions/data/types'

function buildChileRegionMaps() {
	const ids = Object.keys(clRegions.regions).sort(
		(a, b) => Number(a) - Number(b),
	) as RegionId[]

	const regiones: string[] = []
	const comunasPorRegion: Record<string, readonly string[]> = {}

	for (const id of ids) {
		const reg = clRegions.regions[id]
		if (!reg) continue
		regiones.push(reg.name)
		const set = new Set<string>()
		for (const pid of Object.keys(reg.provinces)) {
			const prov = reg.provinces[pid]
			for (const cid of Object.keys(prov.communes)) {
				set.add(prov.communes[cid].name)
			}
		}
		comunasPorRegion[reg.name] = [...set].sort((a, b) =>
			a.localeCompare(b, 'es'),
		)
	}

	return {
		regiones: regiones as readonly string[],
		comunasPorRegion: comunasPorRegion as Readonly<
			Record<string, readonly string[]>
		>,
	}
}

export const {
	regiones: CHILE_REGIONES_NOMBRES,
	comunasPorRegion: CHILE_COMUNAS_POR_REGION,
} = buildChileRegionMaps()

const REGION_SET = new Set(CHILE_REGIONES_NOMBRES)

/** Aliases legacy / textos antiguos → nombre oficial en @clregions/data. */
const REGION_ALIASES: Record<string, string> = {
	'Región Metropolitana': 'Región Metropolitana de Santiago',
	"Región del Libertador Gral. Bernardo O'Higgins":
		"Región del Libertador General Bernardo O'Higgins",
	'Región de Aysén': 'Región de Aysén del General Carlos Ibáñez del Campo',
	'Región de Magallanes': 'Región de Magallanes y de la Antártica Chilena',
}

export function normalizarNombreRegion(raw: string): string | null {
	const t = raw.trim()
	if (!t) return null
	if (REGION_SET.has(t)) return t
	const alias = REGION_ALIASES[t]
	return alias && REGION_SET.has(alias) ? alias : null
}

export function obtenerComunasDeRegion(
	regionNombre?: string,
): readonly string[] {
	if (!regionNombre) return []
	const canon = normalizarNombreRegion(regionNombre)
	if (!canon) return []
	return CHILE_COMUNAS_POR_REGION[canon] ?? []
}

export function comunaCoincideConRegion(
	regionNombre: string,
	comunaNombre: string,
): boolean {
	const c = comunaNombre.trim()
	if (!c) return false
	const canon = normalizarNombreRegion(regionNombre)
	if (!canon) return false
	const list = CHILE_COMUNAS_POR_REGION[canon]
	return list ? list.some(x => x === c) : false
}

/**
 * Normaliza región (y alias) y deja la comuna solo si existe en esa región.
 */
export function sanitizarRegionYComuna(
	region: string,
	comuna: string,
): { region: string; comuna: string } {
	const canonReg = normalizarNombreRegion(region)
	if (!canonReg) return { region: '', comuna: '' }
	const com = comuna.trim()
	if (!com) return { region: canonReg, comuna: '' }
	return comunaCoincideConRegion(canonReg, com)
		? { region: canonReg, comuna: com }
		: { region: canonReg, comuna: '' }
}
