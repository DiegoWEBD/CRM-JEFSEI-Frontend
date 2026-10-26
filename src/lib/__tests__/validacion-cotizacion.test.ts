import { describe, expect, it, vi } from 'vitest'

import { TAMANO_MAXIMO_ARCHIVO, validarTamanoArchivo } from '@/lib/archivos'
import { aNumero, esquemaCotizacion } from '../validacion-cotizacion'
import { archivoSintetico } from '@/test/fixtures/sesion'

const COTIZACION_VALIDA = {
	tipo: 'tasa',
	id_company: 'comp-01',
	monto_total_asegurado: 1500,
	tasa_afecta: '1.5',
	tasa_excenta: '',
	tasa_politica: '',
	prima_afecta: '',
	prima_excenta: '',
	asistencia_afecta: '',
	asistencia_excenta: '',
	fecha_emision: '2026-01-15',
	fecha_vencimiento: '2026-02-15',
	archivo: null,
}

async function erroresDe(valores: Record<string, unknown>): Promise<Record<string, string[]>> {
	try {
		await esquemaCotizacion.validate(valores, { abortEarly: false })
		return {}
	} catch (err) {
		const acumulados = (err as { inner?: { path?: string; message: string }[] }).inner ?? []
		const porCampo: Record<string, string[]> = {}
		for (const e of acumulados) {
			const campo = e.path ?? '(objeto)'
			;(porCampo[campo] ??= []).push(e.message)
		}
		return porCampo
	}
}

describe('esquemaCotizacion — validación del formulario de cotización', () => {
	it('acepta una cotización completa y con campos opcionales vacíos', async () => {
		expect(await erroresDe(COTIZACION_VALIDA)).toEqual({})
	})

	it('exige tipo, compañía, monto y ambas fechas', async () => {
		const errores = await erroresDe({
			...COTIZACION_VALIDA,
			tipo: undefined,
			id_company: undefined,
			monto_total_asegurado: undefined,
			fecha_emision: undefined,
			fecha_vencimiento: undefined,
		})

		expect(errores.tipo).toContain('Seleccione un tipo de registro')
		expect(errores.id_company).toContain('Seleccione una compañía')
		expect(errores.monto_total_asegurado).toContain('Debe ser mayor a cero')
		expect(errores.fecha_emision).toContain('Requerido')
		expect(errores.fecha_vencimiento).toContain('Requerido')
	})

	it('solo admite tipo tasa o prima', async () => {
		const errores = await erroresDe({ ...COTIZACION_VALIDA, tipo: 'comision' })

		expect(errores.tipo).toContain('Seleccione un tipo de registro')
	})

	it('rechaza un monto total asegurado de cero o negativo', async () => {
		const cero = await erroresDe({ ...COTIZACION_VALIDA, monto_total_asegurado: 0 })
		const negativo = await erroresDe({ ...COTIZACION_VALIDA, monto_total_asegurado: -100 })

		expect(cero.monto_total_asegurado).toContain('Debe ser mayor a cero')
		expect(negativo.monto_total_asegurado).toContain('Debe ser mayor a cero')
	})

	it('no deja pasar tasas ni primas negativas', async () => {
		for (const campo of [
			'tasa_afecta',
			'tasa_excenta',
			'tasa_politica',
			'prima_afecta',
			'prima_excenta',
			'asistencia_afecta',
			'asistencia_excenta',
		]) {
			const errores = await erroresDe({ ...COTIZACION_VALIDA, [campo]: '-1' })
			expect(errores[campo], campo).toContain('No puede ser negativo')
		}
	})

	it('informa cuando un campo numérico opcional no es un número', async () => {
		const errores = await erroresDe({ ...COTIZACION_VALIDA, prima_afecta: 'abc' })

		expect(errores.prima_afecta).toContain('Debe ser un número')
	})

	it('un archivo vacío no bloquea el envío', async () => {
		const errores = await erroresDe({ ...COTIZACION_VALIDA, archivo: null })

		expect(errores.archivo).toBeUndefined()
	})

	it('rechaza un archivo que supera los 25 MB', async () => {
		const errores = await erroresDe({
			...COTIZACION_VALIDA,
			archivo: archivoSintetico(TAMANO_MAXIMO_ARCHIVO + 1),
		})

		expect(errores.archivo).toContain('El archivo no puede superar 25 MB')
	})

	it('acepta un archivo justo en el límite de 25 MB', async () => {
		const errores = await erroresDe({
			...COTIZACION_VALIDA,
			archivo: archivoSintetico(TAMANO_MAXIMO_ARCHIVO),
		})

		expect(errores.archivo).toBeUndefined()
	})
})

describe('validarTamanoArchivo — límite de carga', () => {
	it('devuelve null cuando el archivo es válido', () => {
		expect(validarTamanoArchivo(archivoSintetico(1024))).toBeNull()
	})

	it('informa el límite cuando se supera', () => {
		expect(validarTamanoArchivo(archivoSintetico(TAMANO_MAXIMO_ARCHIVO + 1))).toBe(
			'El archivo no puede superar 25 MB',
		)
	})
})

describe('aNumero — conversión de campos numéricos opcionales', () => {
	it('convierte valores vacíos en 0 para no enviar undefined', () => {
		expect(aNumero('')).toBe(0)
		expect(aNumero('   ')).toBe(0)
		expect(aNumero(undefined)).toBe(0)
	})

	it('convierte el texto numérico a número, ignorando espacios', () => {
		expect(aNumero('1234.5')).toBe(1234.5)
		expect(aNumero('  75  ')).toBe(75)
		expect(aNumero('0')).toBe(0)
	})

	it('no registra el valor del formulario en la consola', () => {
		// Regresión: aNumero() tenía un console.log que volcaba a la consola del
		// navegador los montos que el usuario escribía en la cotización.
		const log = vi.spyOn(console, 'log').mockImplementation(() => {})

		aNumero('1234567')

		expect(log).not.toHaveBeenCalled()
	})
})
