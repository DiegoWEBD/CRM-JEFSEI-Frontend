'use client'

import { useState } from 'react'

import { ObtenerProspectosResponse } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/obtener-prospectos-response'
import CardProspectosClient from '@/components/prospectos/card-prospectos/card-prospectos-client'
import KpisProspectos from '@/components/prospectos/kpis-prospectos/kpis-prospectos'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'

type PanelProspectosClientProps = {
	inicial: ObtenerProspectosResponse
}

export default function PanelProspectosClient({
	inicial,
}: PanelProspectosClientProps) {
	// Consulta sin filtros: mantiene los contadores de los KPI actualizados.
	const { data } = useObtenerProspectos(inicial, null, '', 1, 10, null, null, null)

	const response = data ?? inicial

	const [filtro, setFiltro] = useState<string>('todos')

	return (
		<div className='grid gap-4'>
			<KpisProspectos
				contadoresEstado={response.contadores_estado}
				filtro={filtro}
				onFiltroChange={setFiltro}
			/>

			<CardProspectosClient
				initialData={response}
				filtroExterno={filtro}
				onFiltroChange={setFiltro}
			/>
		</div>
	)
}
