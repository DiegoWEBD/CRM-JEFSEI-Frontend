import { describe, expect, it } from 'vitest'

import {
	errorFortalezaPassword,
	esquemaPassword,
	LONGITUD_MINIMA_PASSWORD,
} from '@/lib/validacion-password'

describe('errorFortalezaPassword — política de contraseñas', () => {
	it('acepta una contraseña conforme', () => {
		expect(errorFortalezaPassword('ClaveSegura123')).toBeNull()
	})

	it('acepta contraseñas con símbolos', () => {
		expect(errorFortalezaPassword('Clave-Segura.2026')).toBeNull()
	})

	it('rechaza contraseñas más cortas que el mínimo', () => {
		expect(errorFortalezaPassword('Corta1a')).toBe(
			`La contraseña debe tener al menos ${LONGITUD_MINIMA_PASSWORD} caracteres`,
		)
	})

	it('rechaza una contraseña de exactamente 11 caracteres', () => {
		expect(errorFortalezaPassword('ClaveSegur1')).toContain('12 caracteres')
	})

	it('rechaza contraseñas que exceden 72 bytes (límite de bcrypt)', () => {
		expect(errorFortalezaPassword('Aa1' + 'x'.repeat(70))).toContain('72 caracteres')
	})

	it('cuenta bytes y no caracteres para el límite superior', () => {
		// 36 'ñ' = 72 bytes + 'aA1' supera el límite aunque sean pocos caracteres
		expect(errorFortalezaPassword('ñ'.repeat(36) + 'aA1')).toContain('72 caracteres')
	})

	it('rechaza contraseñas sin mayúscula', () => {
		expect(errorFortalezaPassword('clavesegura123')).toContain('mayúscula')
	})

	it('rechaza contraseñas sin minúscula', () => {
		expect(errorFortalezaPassword('CLAVESEGURA123')).toContain('minúscula')
	})

	it('rechaza contraseñas sin dígito', () => {
		expect(errorFortalezaPassword('ClaveSeguraLarga')).toContain('dígito')
	})

	it('rechaza contraseñas comunes aunque cumplan las reglas', () => {
		expect(errorFortalezaPassword('Password1234')).toContain('demasiado común')
	})

	it('compara la lista de comunes sin distinguir mayúsculas', () => {
		expect(errorFortalezaPassword('Welcome12345')).toContain('demasiado común')
	})
})

describe('esquemaPassword — esquema Yup de los formularios', () => {
	const requerido = esquemaPassword(true)
	const opcional = esquemaPassword(false)

	it('requerida: el vacío muestra "La contraseña es obligatoria"', async () => {
		await expect(requerido.validate('')).rejects.toThrow('La contraseña es obligatoria')
	})

	it('requerida: acepta una contraseña conforme', async () => {
		await expect(requerido.validate('ClaveSegura123')).resolves.toBe('ClaveSegura123')
	})

	it('requerida: rechaza una contraseña débil con el mensaje específico', async () => {
		await expect(requerido.validate('clavesegura123')).rejects.toThrow(
			'La contraseña debe incluir al menos una letra mayúscula',
		)
	})

	it('opcional: el vacío pasa sin error (mantiene la contraseña actual)', async () => {
		await expect(opcional.validate('')).resolves.toBe('')
	})

	it('opcional: undefined pasa sin error', async () => {
		await expect(opcional.validate(undefined)).resolves.toBeUndefined()
	})

	it('opcional: si se escribe una contraseña débil, se valida igual', async () => {
		await expect(opcional.validate('password123')).rejects.toThrow(
			'La contraseña debe tener al menos 12 caracteres',
		)
	})
})
