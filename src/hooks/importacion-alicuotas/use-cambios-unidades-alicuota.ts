import type {
	AlicuotaOportunidadResponse,
	DesgloseReconstruccionResponse,
	UnidadAlicuota,
	UnidadAlicuotaCambioRequest,
} from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import { useActualizarUnidadesAlicuota } from '@/hooks/importacion-alicuotas/use-actualizar-unidades-alicuota'
import { useState } from 'react'
import { toast } from 'sonner'

// Cambios pendientes de una unidad: solo se informan los campos modificados.
export type CambioUnidad = {
	descartada?: boolean
	monto_asegurado_personalizado?: number | null
}

// Totales proyectados: aplican el borrador de cambios para que el ejecutivo
// vea el resultado esperado antes de guardar.
export type TotalesAlicuotaProyectados = {
	prorrateoActivo: number
	montoReconstruccion: number
	montoSugerido: number
	montoAsegurado: number
	cantidadDescartadas: number
}

export const useCambiosUnidadesAlicuota = (
	idProceso: number,
	data: AlicuotaOportunidadResponse | undefined,
	desglose: DesgloseReconstruccionResponse | undefined,
) => {
	const [montosEditando, setMontosEditando] = useState<Record<number, string>>({})
	const [descartesPendientes, setDescartesPendientes] = useState<Record<number, boolean>>({})
	const actualizarMutation = useActualizarUnidadesAlicuota(idProceso)

	const unidades = data?.unidades ?? []

	function desgloseDe(unidad: UnidadAlicuota) {
		return desglose?.unidades.find(item => item.id_unidad === unidad.id)
	}

	// Cambios pendientes (sin guardar) de una unidad: solo los campos que
	// difieren del valor guardado. Si el usuario vuelve al valor original,
	// la unidad deja de tener cambios.
	function cambiosDe(unidad: UnidadAlicuota): CambioUnidad | null {
		if (unidad.id == null) return null

		const cambios: CambioUnidad = {}
		const texto = montosEditando[unidad.id]

		if (texto !== undefined) {
			const monto = texto.trim() === '' ? null : Number(texto.trim())
			if (monto !== unidad.monto_asegurado_personalizado)
				cambios.monto_asegurado_personalizado = monto
		}

		const descartada = descartesPendientes[unidad.id]
		if (descartada !== undefined && descartada !== unidad.descartada)
			cambios.descartada = descartada

		return Object.keys(cambios).length > 0 ? cambios : null
	}

	function descartadaEfectiva(unidad: UnidadAlicuota): boolean {
		return cambiosDe(unidad)?.descartada ?? unidad.descartada
	}

	// Un monto inválido en el input se ignora en los cálculos: se conserva el
	// valor guardado (el input queda marcado en rojo y «Guardar» lo avisa).
	function montoPersonalizadoEfectivoDe(unidad: UnidadAlicuota): number | null {
		const pendiente = cambiosDe(unidad)?.monto_asegurado_personalizado

		if (pendiente !== undefined && (pendiente == null || Number.isFinite(pendiente)))
			return pendiente

		return unidad.monto_asegurado_personalizado
	}

	function montoVisible(unidad: UnidadAlicuota): string {
		const borrador = unidad.id != null ? montosEditando[unidad.id] : undefined
		if (borrador !== undefined) return borrador

		const calculado = desgloseDe(unidad)
		if (unidad.monto_asegurado_personalizado != null)
			return String(unidad.monto_asegurado_personalizado)
		if (calculado && calculado.tiene_monto_asegurado_personalizado)
			return String(calculado.monto_asegurado)
		return ''
	}

	function cambiarMonto(unidad: UnidadAlicuota, texto: string) {
		if (unidad.id == null) return

		setMontosEditando(prev => ({ ...prev, [unidad.id as number]: texto }))
	}

	function alternarDescarte(unidad: UnidadAlicuota) {
		if (unidad.id == null) return

		const nueva = !descartadaEfectiva(unidad)

		setDescartesPendientes(prev => {
			const siguiente = { ...prev }
			if (nueva === unidad.descartada) delete siguiente[unidad.id as number]
			else siguiente[unidad.id as number] = nueva
			return siguiente
		})
	}

	function usarSugerido(unidad: UnidadAlicuota) {
		if (unidad.id == null) return

		setMontosEditando(prev => ({ ...prev, [unidad.id as number]: '' }))
	}

	function descartarCambios() {
		setMontosEditando({})
		setDescartesPendientes({})
	}

	// Guarda el lote completo en un solo request (todo-o-nada). Devuelve true
	// si quedó todo guardado (no había cambios o el backend los aplicó).
	async function guardarCambios(): Promise<boolean> {
		if (!data) return false

		const pendientes: UnidadAlicuotaCambioRequest[] = []

		for (const unidad of data.unidades) {
			const cambios = cambiosDe(unidad)
			if (cambios == null || unidad.id == null) continue

			const monto = cambios.monto_asegurado_personalizado

			if (monto !== undefined && monto != null && (!Number.isFinite(monto) || monto <= 0)) {
				toast.error(
					`El monto asegurado de la unidad ${unidad.identificador_unidad} debe ser mayor a cero`,
				)
				return false
			}

			const item: UnidadAlicuotaCambioRequest = { id_unidad: unidad.id }

			if (cambios.descartada !== undefined) item.descartada = cambios.descartada
			if (monto !== undefined) item.monto_asegurado_personalizado = monto

			pendientes.push(item)
		}

		if (pendientes.length === 0) return true

		try {
			await actualizarMutation.mutateAsync({ unidades: pendientes })
		} catch {
			toast.error('No se pudieron guardar los cambios en las unidades')
			return false
		}

		setMontosEditando({})
		setDescartesPendientes({})
		toast.success(
			pendientes.length === 1
				? 'Unidad de la alícuota actualizada'
				: `${pendientes.length} unidades de la alícuota actualizadas`,
		)
		return true
	}

	// Totales proyectados con el borrador aplicado. Solo aportan las unidades
	// no descartadas (efectivas) y un monto inválido se ignora (se usa el
	// sugerido/guardado). Sin borrador coinciden exactamente con lo guardado.
	const totales: TotalesAlicuotaProyectados = {
		prorrateoActivo: 0,
		montoReconstruccion: 0,
		montoSugerido: 0,
		montoAsegurado: 0,
		cantidadDescartadas: 0,
	}

	for (const unidad of unidades) {
		if (descartadaEfectiva(unidad)) {
			totales.cantidadDescartadas++
			continue
		}

		const calculado = desgloseDe(unidad)

		totales.prorrateoActivo += unidad.prorrateo
		totales.montoReconstruccion += calculado?.monto_reconstruccion ?? 0
		totales.montoSugerido += calculado?.monto_asegurado_sugerido ?? 0
		totales.montoAsegurado +=
			montoPersonalizadoEfectivoDe(unidad) ?? calculado?.monto_asegurado_sugerido ?? 0
	}

	const cantidadCambios = unidades.filter(unidad => cambiosDe(unidad) != null).length

	return {
		montosEditando,
		cambiosDe,
		descartadaEfectiva,
		montoPersonalizadoEfectivoDe,
		montoVisible,
		desgloseDe,
		cambiarMonto,
		alternarDescarte,
		usarSugerido,
		descartarCambios,
		guardarCambios,
		cantidadCambios,
		guardando: actualizarMutation.isPending,
		totales,
	}
}

export type CambiosUnidadesAlicuota = ReturnType<typeof useCambiosUnidadesAlicuota>
