import type { QueryClient } from '@tanstack/react-query'

// Queries que muestran los cálculos de la alícuota: las unidades importadas y
// el desglose de reconstrucción (monto de reconstrucción y monto sugerido).
// Estos montos dependen de los datos del prospecto (m², UF/m², depreciación,
// etc.) y de la configuración global (valor UF por región y parámetros de
// depreciación), por lo que deben invalidarse cuando esos insumos cambian.

// Invalida las queries de la alícuota. Sin `idProceso` se invalidan las de
// todas las oportunidades (los datos del prospecto afectan a todas); con
// `idProceso`, solo las de esa oportunidad.
export function invalidarConsultasAlicuota(
	queryClient: QueryClient,
	idProceso?: number,
) {
	const alcance = idProceso == null ? [] : [idProceso]

	queryClient.invalidateQueries({ queryKey: ['alicuota-oportunidad', ...alcance] })
	queryClient.invalidateQueries({ queryKey: ['desglose-reconstruccion', ...alcance] })
}
