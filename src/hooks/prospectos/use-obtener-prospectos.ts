'use client'

import ProspectoResumenJson from '@/aplicacion/prospectos/dto/prospecto-resumen-json'
import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos'
import { useEffect, useState } from 'react'

export const useObtenerProspectos = (rutUsuario?: string) => {
	const [prospectos, setProspectos] = useState<ProspectoResumenJson[]>([])

	useEffect(() => {
		obtenerProspectos(rutUsuario).then(setProspectos).catch(console.error)
	}, [rutUsuario])

	return { prospectos }
}
