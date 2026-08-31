import { obtenerPolizas } from '@/aplicacion/polizas/use_cases/obtener_polizas/obtener_polizas'
import PanelPolizasClient from '@/components/paneles/polizas/panel-polizas-client'
import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'

export async function PanelInner() {
	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: [
			'panel-polizas',
			undefined,
			undefined,
			undefined,
			undefined,
			'VIGENTE',
			1,
			10,
		],
		queryFn: () =>
			obtenerPolizas({ pagina: 1, tamano_pagina: 10, estado: 'VIGENTE' }),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PanelPolizasClient />
		</HydrationBoundary>
	)
}
