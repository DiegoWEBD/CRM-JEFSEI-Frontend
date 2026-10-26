import * as Yup from 'yup'
import { validarTamanoArchivo } from '@/lib/archivos'

// Convierte un valor de input numérico vacío (o solo espacios) en 0.
// Se usa al armar el request de la mutación: los campos de primas,
// asistencias y tasas son opcionales en el formulario y se envían en 0 si vienen vacíos.
export function aNumero(valor?: string): number {
	if (!valor) return 0
	const limpio = valor.toString().trim()
	return limpio === '' ? 0 : Number(limpio)
}

// Convierte '' en null antes del cast para que Yup.number().nullable() acepte campos vacíos.
function vacioANull(valor: unknown, original: unknown): unknown {
	return original === '' ? null : valor
}

// Campos de tasas, primas y asistencias: opcionales, pero si vienen no pueden ser negativos.
const numeroOpcional = Yup.number()
	.nullable()
	.transform(vacioANull)
	.typeError('Debe ser un número')
	.min(0, 'No puede ser negativo')

export const esquemaCotizacion = Yup.object({
	tipo: Yup.string()
		.oneOf(['tasa', 'prima'], 'Seleccione un tipo de registro')
		.required('Seleccione un tipo de registro'),
	id_company: Yup.string().required('Seleccione una compañía'),
	monto_total_asegurado: Yup.number()
		.nullable()
		.transform(vacioANull)
		.typeError('Debe ser un número')
		.required('Debe ser mayor a cero')
		.positive('Debe ser mayor a cero'),
	tasa_afecta: numeroOpcional,
	tasa_excenta: numeroOpcional,
	tasa_politica: numeroOpcional,
	prima_afecta: numeroOpcional,
	prima_excenta: numeroOpcional,
	asistencia_afecta: numeroOpcional,
	asistencia_excenta: numeroOpcional,
	fecha_emision: Yup.string().required('Requerido'),
	fecha_vencimiento: Yup.string().required('Requerido'),
	archivo: Yup.mixed<File>()
		.nullable()
		.test(
			'tamano-archivo',
			'El archivo no puede superar 25 MB',
			value => !value || validarTamanoArchivo(value) === null,
		),
})
