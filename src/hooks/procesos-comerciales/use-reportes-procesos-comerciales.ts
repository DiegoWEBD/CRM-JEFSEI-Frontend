'use client'

import type { ObtenerReportesResponse } from '@/aplicacion/procesos-comerciales/dto/obtener-reportes-response'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useReportesProcesosComerciales = (
	initialData: ObtenerReportesResponse,
	textoBusqueda: string,
	ejecutivos: string[] | null,
	etapas: string[] | null,
	estadosComerciales: string[] | null,
	estadoSemaforo: string[] | null,
	estadoProceso: string | null,
	cerrado: boolean | null,
	pagina: number,
	tamanoPagina: number,
) => {
	const esConsultaInicial =
		textoBusqueda === '' &&
		ejecutivos === null &&
		etapas === null &&
		estadosComerciales === null &&
		estadoSemaforo === null &&
		estadoProceso === null &&
		cerrado === false &&
		pagina === 1 &&
		tamanoPagina === 15

	return useQuery<ObtenerReportesResponse>({
		queryKey: [
			'reportes-procesos-comerciales',
			textoBusqueda,
			ejecutivos,
			etapas,
			estadosComerciales,
			estadoSemaforo,
			estadoProceso,
			cerrado,
			pagina,
			tamanoPagina,
		],
		queryFn: async () => {
			const body: Record<string, unknown> = {
				pagina,
				tamano_pagina: tamanoPagina,
			}
			if (textoBusqueda) body.texto_busqueda = textoBusqueda
			if (ejecutivos) body.ejecutivos = ejecutivos
			if (etapas) body.etapas = etapas
			if (estadosComerciales) body.estados_comerciales = estadosComerciales
			if (estadoSemaforo) body.estado_semaforo = estadoSemaforo
			if (estadoProceso) body.estado_proceso = estadoProceso
			if (cerrado !== null) body.cerrado = cerrado
			const response = await axios.post(
				'/api/procesos-comerciales/reportes',
				body,
			)
			return response.data
		},
		...(esConsultaInicial ? { initialData } : {}),
		placeholderData: keepPreviousData,
	})
}
