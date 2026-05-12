import ProspectoResumenJson from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'

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
		async (
			rut_riesgo: string | null,
			nombre_riesgo: string,
			nombre_contacto: string,
			telefono_contacto: string,
			correo_contacto: string | null,
			direccion: string,
			id_comuna: number,
			observaciones: string | null,
			id_linea_negocio: number,
			cargo_contacto: string | null,
			tiene_locales_comerciales: boolean | null,
			uso_del_condominio: string | null,
			numero_pisos: number | null,
			numero_torres: number | null,
			cantidad_departamentos: number | null,
			cantidad_subterraneos: number | null,
			tiene_piscina: boolean | null,
			year_construccion: number | null,
			metros_cuadrados: number | null,
			desea_ser_contactado: boolean | null,
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

			try {
				await registrarProspecto(request)
			} catch (err) {
				setError((err as AxiosError).message)
				throw err
			} finally {
				setCargando(false)
			}
		},
		[],
	)

	return { prospectos, cargando, error, cargarProspectos, crearProspecto }
}
