'use client'

import ProspectoResumenJson from '@/aplicacion/prospectos/dto/prospecto-resumen-json'
import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos'
import { RegistrarProspectoRequest } from '@/aplicacion/prospectos/use-cases/registrar-prospecto/dto/registrar-prospecto-request'
import { registrarProspecto } from '@/aplicacion/prospectos/use-cases/registrar-prospecto/registrar-prospecto'
import { AxiosError } from 'axios'
import { useCallback, useState } from 'react'

export const useProspectos = () => {
	const [prospectos, setProspectos] = useState<ProspectoResumenJson[]>([])
	const [cargando, setCargando] = useState<boolean>(false)
	const [error, setError] = useState<string | undefined>(undefined)

	const cargarProspectos = useCallback((rutUsuario?: string) => {
		setCargando(true)

		obtenerProspectos(rutUsuario)
			.then(setProspectos)
			.catch((err: AxiosError) => setError(err.message))
			.finally(() => setCargando(false))
	}, [])

	const crearProspecto = useCallback(
		(
			rut_riesgo: string | undefined,
			nombre_riesgo: string,
			nombre_contacto: string,
			telefono_contacto: string,
			correo_contacto: string | undefined,
			direccion: string,
			id_comuna: number,
			observaciones: string | undefined,
			id_linea_negocio: number,
			cargo_contacto: string | undefined,
			tiene_locales_comerciales: boolean | undefined,
			uso_del_condominio: string | undefined,
			numero_pisos: number | undefined,
			numero_torres: number | undefined,
			cantidad_departamentos: number | undefined,
			cantidad_subterraneos: number | undefined,
			tiene_piscina: boolean | undefined,
			year_construccion: number | undefined,
			metros_cuadrados: number | undefined,
			desea_ser_contactado: boolean | undefined,
		) => {
			setCargando(true)

			const request: RegistrarProspectoRequest = {
				rut_riesgo,
				nombre_riesgo,
				nombre_contacto,
				telefono_contacto,
				correo_contacto,
				direccion,
				id_comuna,
				observaciones,
				id_linea_negocio,
				cargo_contacto,
				tiene_locales_comerciales,
				uso_del_condominio,
				numero_pisos,
				numero_torres,
				cantidad_departamentos,
				cantidad_subterraneos,
				tiene_piscina,
				year_construccion,
				metros_cuadrados,
				desea_ser_contactado,
			}

			registrarProspecto(request)
				.catch((err: AxiosError) => setError(err.message))
				.finally(() => setCargando(false))
		},
		[],
	)

	return { prospectos, cargando, error, cargarProspectos, crearProspecto }
}
