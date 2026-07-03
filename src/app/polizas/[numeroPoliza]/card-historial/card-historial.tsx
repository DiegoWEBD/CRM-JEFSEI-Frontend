'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { HistorialPoliza } from '@/components/historial-poliza'
import { useObtenerHistorialEstado } from '@/hooks/procesos-comerciales/use-obtener-historial-estado'

type CardHistorialProps = {
	idProcesoComercial: number | null
}

export default function CardHistorial({
	idProcesoComercial,
}: CardHistorialProps) {
	if (idProcesoComercial === null) return null

	const { data: historial, isLoading: historialCargando } =
		useObtenerHistorialEstado(idProcesoComercial)

	return (
		<Card className='border-border shadow-none'>
			<CardHeader className='border-b border-border pb-2 pt-3'>
				<CardTitle className='text-sm font-semibold'>Historial</CardTitle>
			</CardHeader>
			<CardContent className='p-4'>
				<HistorialPoliza
					historial={historial}
					cargando={historialCargando}
				/>
			</CardContent>
		</Card>
	)
}
