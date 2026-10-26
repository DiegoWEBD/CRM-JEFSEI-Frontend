import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock(
	'@/aplicacion/prospectos/use-cases/registrar-prospecto/registrar-prospecto',
	() => ({ registrarProspecto: vi.fn() }),
)

import { registrarProspecto } from '@/aplicacion/prospectos/use-cases/registrar-prospecto/registrar-prospecto'
import { useFormularioRegistrarProspecto } from '../use-formulario-registrar-prospecto'

const registrarProspectoMock = vi.mocked(registrarProspecto)

function montarHook() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	})
	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
	return renderHook(() => useFormularioRegistrarProspecto(), { wrapper })
}

const PROSPECTO_VALIDO = {
	rut_riesgo: '12.345.678-5',
	nombre_riesgo: 'Condominio Los Alerces',
	correo_contacto: 'contacto@condominio.test',
	linea_negocio: 'condominio',
	porcentaje_espacios_comunes: 25,
	year_construccion: 2010,
	numero_pisos: 12,
	numero_torres: 2,
	cantidad_departamentos: 96,
	cantidad_subterraneos: 1,
	metros_cuadrados: 1500,
}

beforeEach(() => {
	// restoreMocks deja los mocks sin implementación: se redeclara en cada prueba.
	registrarProspectoMock.mockReset()
	registrarProspectoMock.mockResolvedValue(undefined as never)
})

function errores(result: { current: { formik: { errors: unknown } } }): Record<string, string> {
	return result.current.formik.errors as Record<string, string>
}

async function enviar(valores: Record<string, unknown>) {
	const { result } = montarHook()
	await act(async () => {
		await result.current.formik.setValues({
			...result.current.formik.values,
			...valores,
		})
	})
	await act(async () => {
		await result.current.formik.submitForm()
	})
	return result
}

describe('registro de prospecto — validación del formulario', () => {
	it('exige el nombre del riesgo', async () => {
		const result = await enviar({ ...PROSPECTO_VALIDO, nombre_riesgo: '' })

		await waitFor(() =>
			expect(errores(result).nombre_riesgo).toBe(
				'El nombre del riesgo es obligatorio',
			),
		)
		expect(registrarProspectoMock).not.toHaveBeenCalled()
	})

	it('rechaza un RUT inválido pero lo da por opcional si se deja vacío', async () => {
		const invalido = await enviar({ ...PROSPECTO_VALIDO, rut_riesgo: '12.345.678-9' })
		await waitFor(() =>
			expect(errores(invalido).rut_riesgo).toBe('RUT inválido.'),
		)
		expect(registrarProspectoMock).not.toHaveBeenCalled()

		registrarProspectoMock.mockClear()
		const vacio = await enviar({ ...PROSPECTO_VALIDO, rut_riesgo: '' })
		await waitFor(() => expect(errores(vacio).rut_riesgo).toBeUndefined())
	})

	it('rechaza un correo con formato inválido', async () => {
		const result = await enviar({ ...PROSPECTO_VALIDO, correo_contacto: 'no-es-un-correo' })

		await waitFor(() =>
			expect(errores(result).correo_contacto).toBe('Correo inválido'),
		)
		expect(registrarProspectoMock).not.toHaveBeenCalled()
	})

	it('exige una línea de negocio de las admitidas', async () => {
		const result = await enviar({ ...PROSPECTO_VALIDO, linea_negocio: 'otra' })

		await waitFor(() => expect(errores(result).linea_negocio).toBeDefined())
		expect(registrarProspectoMock).not.toHaveBeenCalled()
	})

	it('limita el porcentaje de espacios comunes al rango 0-100', async () => {
		const alto = await enviar({ ...PROSPECTO_VALIDO, porcentaje_espacios_comunes: 150 })
		await waitFor(() =>
			expect(errores(alto).porcentaje_espacios_comunes).toContain(
				'entre 0 y 100',
			),
		)

		const bajo = await enviar({ ...PROSPECTO_VALIDO, porcentaje_espacios_comunes: -1 })
		await waitFor(() =>
			expect(errores(bajo).porcentaje_espacios_comunes).toBeDefined(),
		)
		expect(registrarProspectoMock).not.toHaveBeenCalled()
	})

	it('valida el año de construcción contra el rango permitido', async () => {
		const antiguo = await enviar({ ...PROSPECTO_VALIDO, year_construccion: 1800 })
		await waitFor(() => expect(errores(antiguo).year_construccion).toBeDefined())

		const futuro = await enviar({
			...PROSPECTO_VALIDO,
			year_construccion: new Date().getFullYear() + 5,
		})
		await waitFor(() => expect(errores(futuro).year_construccion).toBeDefined())
		expect(registrarProspectoMock).not.toHaveBeenCalled()
	})

	it('no acepta valores negativos en las cantidades del condominio', async () => {
		for (const campo of [
			'numero_pisos',
			'numero_torres',
			'cantidad_departamentos',
			'cantidad_subterraneos',
			'metros_cuadrados',
		]) {
			registrarProspectoMock.mockClear()
			const result = await enviar({ ...PROSPECTO_VALIDO, [campo]: -1 })
			await waitFor(() => expect(errores(result)[campo]).toBeDefined())
			expect(registrarProspectoMock, campo).not.toHaveBeenCalled()
		}
	})
})

describe('registro de prospecto — payload enviado', () => {
	it('convierte el porcentaje de espacios comunes a fracción del total', async () => {
		await enviar({ ...PROSPECTO_VALIDO, porcentaje_espacios_comunes: 25 })

		await waitFor(() => expect(registrarProspectoMock).toHaveBeenCalledTimes(1))
		const request = registrarProspectoMock.mock.calls[0]![0] as unknown as Record<string, unknown>
		// 25 % se persiste como 0,25: la UI trabaja en porcentaje y el dominio en fracción.
		expect(request.porcentaje_espacios_comunes).toBe(0.25)
	})

	it('traduce la línea de negocio al id que usa el backend', async () => {
		await enviar({ ...PROSPECTO_VALIDO, linea_negocio: 'condominio' })
		await waitFor(() => expect(registrarProspectoMock).toHaveBeenCalledTimes(1))
		expect(
			(registrarProspectoMock.mock.calls[0]![0] as unknown as Record<string, unknown>).id_linea_negocio,
		).toBe(10)

		registrarProspectoMock.mockClear()
		await enviar({ ...PROSPECTO_VALIDO, linea_negocio: 'lineas_personales' })
		await waitFor(() => expect(registrarProspectoMock).toHaveBeenCalledTimes(1))
		expect(
			(registrarProspectoMock.mock.calls[0]![0] as unknown as Record<string, unknown>).id_linea_negocio,
		).toBe(11)
	})

	it('envía null en los campos vacíos en lugar de cadenas en blanco', async () => {
		await enviar({
			...PROSPECTO_VALIDO,
			rut_riesgo: '',
			correo_contacto: '',
			direccion: '',
			region: '',
			comuna: '',
			observaciones: '',
			porcentaje_espacios_comunes: '',
		})

		await waitFor(() => expect(registrarProspectoMock).toHaveBeenCalledTimes(1))
		const request = registrarProspectoMock.mock.calls[0]![0] as unknown as Record<string, unknown>
		for (const campo of [
			'rut_riesgo',
			'correo_contacto',
			'direccion',
			'region',
			'comuna',
			'observaciones',
			'porcentaje_espacios_comunes',
		]) {
			expect(request[campo], campo).toBeNull()
		}
	})

	it('conserva el cero como valor real y no lo convierte en vacío', async () => {
		await enviar({
			...PROSPECTO_VALIDO,
			porcentaje_espacios_comunes: 0,
			cantidad_subterraneos: 0,
			numero_torres: 0,
		})

		await waitFor(() => expect(registrarProspectoMock).toHaveBeenCalledTimes(1))
		const request = registrarProspectoMock.mock.calls[0]![0] as unknown as Record<string, unknown>
		expect(request.porcentaje_espacios_comunes).toBe(0)
		expect(request.cantidad_subterraneos).toBe(0)
		expect(request.numero_torres).toBe(0)
	})
})
