import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useFormularioRegistrarPoliza } from '../use-formulario-registrar-poliza'
import { simularRed, type RedSimulada } from '@/test/helpers/red-simulada'

const POLIZA_VALIDA = {
	numero_poliza: 'POL-2026-001 ',
	id_company: 7,
	tipo: 'nueva',
	prima_neta: 150000,
	comision_corredora_pct: 15,
	fecha_emision: '2026-01-15',
	inicio_vigencia: '2026-01-15',
	fin_vigencia: '2027-01-15',
}

function montarHook(props: { onClose?: () => void } = {}) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	})
	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
	return renderHook(
		() =>
			useFormularioRegistrarPoliza({
				idProceso: 321,
				idProspecto: 55,
				idCliente: 9,
				...props,
			}),
		{ wrapper },
	)
}

function errores(result: { current: { formik: { errors: unknown } } }): Record<string, string> {
	return result.current.formik.errors as Record<string, string>
}

async function enviar(valores: Record<string, unknown>, onClose?: () => void) {
	const { result } = montarHook({ onClose })
	await act(async () => {
		await result.current.formik.setValues({
			...result.current.formik.values,
			...valores,
		})
	})
	await act(async () => {
		// Un rechazo del backend hace fallar el onSubmit; las aserciones se hacen
		// sobre las llamadas y los errores, no sobre la promesa de submitForm.
		await result.current.formik.submitForm().catch(() => undefined)
	})
	return result
}

let red: RedSimulada

beforeEach(() => {
	red = simularRed(() => ({ status: 200, data: { numero_poliza: 'POL-2026-001' } }), [axios])
})

describe('registro de póliza — validación del formulario', () => {
	it('exige número de póliza, compañía, prima, comisión y fechas', async () => {
		const result = await enviar({
			numero_poliza: '',
			id_company: 0,
			prima_neta: 0,
			comision_corredora_pct: '',
			fecha_emision: '',
			inicio_vigencia: '',
			fin_vigencia: '',
		})

		await waitFor(() => {
			expect(errores(result).numero_poliza).toBeDefined()
			expect(errores(result).id_company).toBeDefined()
			expect(errores(result).prima_neta).toBeDefined()
			expect(errores(result).comision_corredora_pct).toBeDefined()
			expect(errores(result).fecha_emision).toBeDefined()
			expect(errores(result).inicio_vigencia).toBeDefined()
			expect(errores(result).fin_vigencia).toBeDefined()
		})
		expect(red.llamadas).toHaveLength(0)
	})

	it('no admite una prima neta de cero ni negativa', async () => {
		const result = await enviar({ ...POLIZA_VALIDA, prima_neta: 0 })

		await waitFor(() => expect(errores(result).prima_neta).toBeDefined())
		expect(red.llamadas).toHaveLength(0)
	})

	it('acota la comisión de la corredora al rango 0-100 por ciento', async () => {
		const alta = await enviar({ ...POLIZA_VALIDA, comision_corredora_pct: 150 })
		await waitFor(() => expect(errores(alta).comision_corredora_pct).toBeDefined())

		const baja = await enviar({ ...POLIZA_VALIDA, comision_corredora_pct: -5 })
		await waitFor(() => expect(errores(baja).comision_corredora_pct).toBeDefined())
		expect(red.llamadas).toHaveLength(0)
	})

	it('solo admite tipo nueva o renovacion', async () => {
		const result = await enviar({ ...POLIZA_VALIDA, tipo: 'endoso' })

		await waitFor(() => expect(errores(result).tipo).toBeDefined())
		expect(red.llamadas).toHaveLength(0)
	})
})

describe('registro de póliza — payload enviado', () => {
	it('convierte el porcentaje de comisión a fracción, como espera el backend', async () => {
		await enviar(POLIZA_VALIDA)

		await waitFor(() => expect(red.llamadas).toHaveLength(1))
		const payload = JSON.parse(String(red.llamadas[0]!.data)) as Record<string, unknown>
		// 15 % se envía como 0,15: si se enviara 15 la comisión sería 15 veces mayor.
		expect(payload.comision_corredora_pct).toBe(0.15)
	})

	it('envía el número de póliza sin espacios sobrantes', async () => {
		await enviar(POLIZA_VALIDA)

		await waitFor(() => expect(red.llamadas).toHaveLength(1))
		const payload = JSON.parse(String(red.llamadas[0]!.data)) as Record<string, unknown>
		expect(payload.numero_poliza).toBe('POL-2026-001')
	})

	it('envía el resto de los campos tal cual, sin transformarlos', async () => {
		await enviar(POLIZA_VALIDA)

		await waitFor(() => expect(red.llamadas).toHaveLength(1))
		expect(JSON.parse(String(red.llamadas[0]!.data))).toEqual({
			numero_poliza: 'POL-2026-001',
			tipo: 'nueva',
			id_company: 7,
			prima_neta: 150000,
			comision_corredora_pct: 0.15,
			fecha_emision: '2026-01-15',
			inicio_vigencia: '2026-01-15',
			fin_vigencia: '2027-01-15',
		})
		expect(red.llamadas[0]!.url).toBe('/api/procesos-comerciales/321/polizas')
	})

	it('una comisión de 0 % se envía como 0 y no como campo vacío', async () => {
		await enviar({ ...POLIZA_VALIDA, comision_corredora_pct: 0 })

		await waitFor(() => expect(red.llamadas).toHaveLength(1))
		const payload = JSON.parse(String(red.llamadas[0]!.data)) as Record<string, unknown>
		expect(payload.comision_corredora_pct).toBe(0)
	})

	it('cierra el formulario solo cuando el registro fue aceptado', async () => {
		const onClose = vi.fn()
		await enviar(POLIZA_VALIDA, onClose)

		await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
	})

	it('no cierra el formulario cuando el backend rechaza el registro', async () => {
		red.restaurar()
		red = simularRed(
			() => ({ status: 422, data: { detail: 'La póliza ya existe' } }),
			[axios],
		)
		const onClose = vi.fn()

		await enviar(POLIZA_VALIDA, onClose)

		await waitFor(() => expect(red.llamadas).toHaveLength(1))
		expect(onClose).not.toHaveBeenCalled()
	})
})
