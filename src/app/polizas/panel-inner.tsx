import { obtenerPolizas } from '@/aplicacion/polizas/use_cases/obtener_polizas/obtener_polizas'
import PanelPolizasClient from '@/components/paneles/polizas/panel-polizas-client'

export async function PanelInner() {
	const initialData = await obtenerPolizas({ pagina: 1, tamano_pagina: 20 })
	return <PanelPolizasClient initialData={initialData} />
}
