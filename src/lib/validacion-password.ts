/**
 * Política de fortaleza de contraseñas (validación de formulario).
 *
 * Debe mantenerse en paridad con backend/app/dominio/usuario/validar_password.py:
 * - de 12 a 72 caracteres (72 bytes es el límite duro de bcrypt)
 * - al menos una letra mayúscula, una letra minúscula y un dígito
 * - no pertenecer a la lista de contraseñas comunes
 *
 * El backend es quien hace cumplir la política; aquí se replica para dar
 * feedback inmediato en los formularios.
 */
import * as Yup from 'yup'

export const LONGITUD_MINIMA_PASSWORD = 12

export const REQUISITOS_PASSWORD =
	'Mínimo 12 caracteres, con al menos una mayúscula, una minúscula y un dígito.'

// Contraseñas frecuentes que cumplen las reglas de longitud y clases pero son
// predecibles. Se comparan en minúsculas. Paridad con el backend.
const CONTRASENAS_COMUNES = new Set([
	'123456789012',
	'password123',
	'password1234',
	'password12345',
	'passw0rd123',
	'passw0rd1234',
	'admin123456',
	'admin1234567',
	'administrator1',
	'qwerty123456',
	'qwertyuiop123',
	'asdfghjkl123',
	'zxcvbnm12345',
	'welcome12345',
	'welcome123456',
	'letmein12345',
	'letmein123456',
	'iloveyou1234',
	'iloveyou12345',
	'monkey123456',
	'dragon123456',
	'sunshine1234',
	'princess1234',
	'football1234',
	'baseball1234',
	'superman1234',
	'starwars1234',
	'trustno12345',
	'whatever1234',
	'michael12345',
	'shadow123456',
	'master123456',
	'jennifer1234',
	'jordan123456',
	'contrasena123',
	'clave1234567',
	'seguridad123',
])

/** Devuelve el mensaje de error de la política, o null si la contraseña es válida. */
export function errorFortalezaPassword(password: string): string | null {
	if (password.length < LONGITUD_MINIMA_PASSWORD) {
		return `La contraseña debe tener al menos ${LONGITUD_MINIMA_PASSWORD} caracteres`
	}
	if (new TextEncoder().encode(password).length > 72) {
		return 'La contraseña no puede exceder 72 caracteres'
	}
	if (!/[A-Z]/.test(password)) {
		return 'La contraseña debe incluir al menos una letra mayúscula'
	}
	if (!/[a-z]/.test(password)) {
		return 'La contraseña debe incluir al menos una letra minúscula'
	}
	if (!/[0-9]/.test(password)) {
		return 'La contraseña debe incluir al menos un dígito'
	}
	if (CONTRASENAS_COMUNES.has(password.toLowerCase())) {
		return 'La contraseña es demasiado común; elija otra'
	}
	return null
}

/**
 * Esquema Yup de contraseña para formik.
 *
 * Con `requerida = true` (alta de usuario) el vacío muestra "La contraseña es
 * obligatoria"; con `requerida = false` (edición) el vacío pasa sin error
 * porque significa "mantener la contraseña actual".
 */
export function esquemaPassword(requerida: boolean) {
	return Yup.string().test('fortaleza-password', function (valor) {
		const password = typeof valor === 'string' ? valor : ''
		if (!password) {
			return requerida
				? this.createError({ message: 'La contraseña es obligatoria' })
				: true
		}
		const error = errorFortalezaPassword(password)
		return error ? this.createError({ message: error }) : true
	})
}
