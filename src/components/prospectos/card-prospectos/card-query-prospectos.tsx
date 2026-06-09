'use client'

import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { useObtenerProspectos } from '@/hooks/prospectos/use-obtener-prospectos'
import CardProspectosClient from './card-prospectos-client'

type CardQueryProspectosProps = {
	prospectosIniciales: ProspectoResumenJson[]
}

export default function CardQueryProspectos({
	prospectosIniciales,
}: CardQueryProspectosProps) {
	const { data: prospectos } = useObtenerProspectos(prospectosIniciales)

	return <CardProspectosClient prospectos={prospectos} />
}
