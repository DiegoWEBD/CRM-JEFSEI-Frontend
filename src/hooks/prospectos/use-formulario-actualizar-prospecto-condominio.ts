import { FormularioInitialValues } from '@/app/prospectos/components/dto/formulario-initial-values'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { useFormik } from 'formik'
import { useState } from 'react'

type UseFormularioActualizarProspecto = {
	prospecto: ProspectoCondominio
}

export const useFormularioActualizarProspectoCondominio = ({
	prospecto,
}: UseFormularioActualizarProspecto) => {
	const [cargando, setCargando] = useState(false)

	const formik = useFormik<FormularioInitialValues>({
		initialValues: {
			rut_riesgo: prospecto.rut_riesgo,
			nombre_riesgo: prospecto.nombre_riesgo,
			nombre_contacto: prospecto.nombre_contacto,
			telefono_contacto: prospecto.telefono_contacto,
			correo_contacto: prospecto.correo_contacto,
			direccion: prospecto.direccion,
			region: prospecto.region,
			comuna: prospecto.comuna,
			observaciones: prospecto.observaciones,
			id_linea_negocio: prospecto.linea_negocio.id,
			cargo_contacto: prospecto.cargo_contacto,
			tiene_locales_comerciales: prospecto.tiene_locales_comerciales,
			uso_del_condominio: prospecto.uso_del_condominio,
			numero_pisos: prospecto.numero_pisos,
			numero_torres: prospecto.numero_torres,
			cantidad_departamentos: prospecto.cantidad_departamentos,
			cantidad_subterraneos: prospecto.cantidad_subterraneos,
			tiene_piscina: prospecto.tiene_piscina,
			year_construccion: prospecto.year_construccion,
			metros_cuadrados: prospecto.metros_cuadrados,
			desea_ser_contactado: prospecto.desea_ser_contactado,
		},
		onSubmit: async values => {
			setCargando(true)
			console.log(values)

			/*await registrarProspecto(
                values.rut_riesgo ?? null,
                values.nombre_riesgo,
                values.nombre_contacto,
                values.telefono_contacto,
                values.correo_contacto ?? null,
                values.direccion,
                values.id_comuna,
                values.observaciones ?? null,
                values.id_linea_negocio,
                values.cargo_contacto ?? null,
                values.tiene_locales_comerciales
                    ? normalizarTexto(values.tiene_locales_comerciales) == 'si'
                    : null,
                values.uso_del_condominio ?? null,
                values.numero_pisos ?? null,
                values.numero_torres ?? null,
                values.cantidad_departamentos ?? null,
                values.cantidad_subterraneos ?? null,
                values.tiene_piscina
                    ? normalizarTexto(values.tiene_piscina) == 'si'
                    : null,
                values.year_construccion ?? null,
                values.metros_cuadrados ?? null,
                values.desea_ser_contactado
                    ? normalizarTexto(values.desea_ser_contactado) == 'si'
                    : null,
            )*/

			setCargando(false)
		},
	})

	return {
		formik,
		cargando,
	}
}
