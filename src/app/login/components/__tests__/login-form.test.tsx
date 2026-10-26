import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		replace: vi.fn(),
		refresh: vi.fn(),
	}),
}))

import axios from 'axios'
import LoginForm from '../login-form'
import { AuthProvider } from '@/contexts/auth-context'
import { clientAxios } from '@/infraestructura/axios/client-axios'
import { payloadSesion } from '@/test/fixtures/sesion'
import { simularRed, type RedSimulada, type Responder, type RespuestaSimulada } from '@/test/helpers/red-simulada'

function renderLogin() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	})
	return render(
		<QueryClientProvider client={queryClient}>
			<AuthProvider initialPayload={payloadSesion()}>
				<LoginForm />
			</AuthProvider>
		</QueryClientProvider>,
	)
}

function instalarLogin(responder: Responder): RedSimulada {
	return simularRed(responder, [axios, clientAxios])
}

/** Respuesta que el mock de red resolverá solo cuando el test lo indique. */
function respuestaPendiente() {
	let liberar!: (r: RespuestaSimulada) => void
	const promesa = new Promise<RespuestaSimulada>(resolve => {
		liberar = resolve
	})
	return { promesa, liberar }
}

async function escribirYEnviar(rut: string, password: string) {
	renderLogin()
	const usuario = userEvent.setup()
	await usuario.type(screen.getByLabelText('RUT'), rut)
	await usuario.type(screen.getByLabelText('Contraseña'), password)
	await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
}

describe('LoginForm — envío de credenciales', () => {
	it('envía el RUT sin puntos ni guion, tal como lo espera el backend', async () => {
		const red = instalarLogin(() => ({ status: 200, data: {} }))

		await escribirYEnviar('12.345.678-5', 'clave-de-prueba')

		expect(red.llamadas).toHaveLength(1)
		expect(red.llamadas[0]!.url).toBe('/api/auth/login')
		expect(JSON.parse(String(red.llamadas[0]!.data))).toEqual({
			rut: '123456785',
			password: 'clave-de-prueba',
		})
		red.restaurar()
	})

	it('pasa a mayúscula el dígito verificador K', async () => {
		const red = instalarLogin(() => ({ status: 200, data: {} }))

		await escribirYEnviar('00.000.040-k', 'clave')

		expect(JSON.parse(String(red.llamadas[0]!.data)).rut).toBe('00000040K')
		red.restaurar()
	})
})

describe('LoginForm — errores de autenticación', () => {
	it('muestra Credenciales inválidas en un aviso accesible cuando el login falla', async () => {
		const red = instalarLogin(() => ({
			status: 401,
			data: { detail: 'Usuario o contraseña incorrectos' },
		}))

		await escribirYEnviar('12.345.678-5', 'clave-mala')

		const alerta = await screen.findByRole('alert')
		expect(alerta).toHaveTextContent('Credenciales inválidas')
		// El detalle del backend no se filtra a la UI.
		expect(alerta).not.toHaveTextContent('Usuario o contraseña incorrectos')
		red.restaurar()
	})

	it('ante un fallo de red muestra el mismo aviso, sin datos internos', async () => {
		const red = instalarLogin(() => {
			throw new Error('ECONNREFUSED 10.0.0.5:8000')
		})

		await escribirYEnviar('12.345.678-5', 'clave')

		const alerta = await screen.findByRole('alert')
		expect(alerta).toHaveTextContent('Credenciales inválidas')
		expect(alerta).not.toHaveTextContent('ECONNREFUSED')
		expect(alerta).not.toHaveTextContent('10.0.0.5')
		red.restaurar()
	})

	it('conserva lo escrito tras un error para poder corregirlo', async () => {
		const red = instalarLogin(() => ({ status: 401, data: {} }))

		await escribirYEnviar('12.345.678-5', 'clave-mala')
		await screen.findByRole('alert')

		expect(screen.getByLabelText('RUT')).toHaveValue('12.345.678-5')
		expect(screen.getByLabelText('Contraseña')).toHaveValue('clave-mala')
		red.restaurar()
	})
})

describe('LoginForm — estado durante el envío', () => {
	it('bloquea el botón y avisa que está iniciando sesión mientras se resuelve', async () => {
		const { promesa, liberar } = respuestaPendiente()
		const red = simularRed(() => promesa, [axios, clientAxios])
		const usuario = userEvent.setup()

		renderLogin()
		await usuario.type(screen.getByLabelText('RUT'), '12.345.678-5')
		await usuario.type(screen.getByLabelText('Contraseña'), 'clave')
		await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

		expect(screen.getByRole('button', { name: /Iniciando sesión/ })).toBeDisabled()

		liberar({ status: 200, data: {} })
		await waitFor(() =>
			expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeEnabled(),
		)
		red.restaurar()
	})

	it('no muestra el aviso de error antes de recibir la respuesta', async () => {
		const { promesa, liberar } = respuestaPendiente()
		const red = simularRed(() => promesa, [axios, clientAxios])
		const usuario = userEvent.setup()

		renderLogin()
		await usuario.type(screen.getByLabelText('RUT'), '12.345.678-5')
		await usuario.type(screen.getByLabelText('Contraseña'), 'clave')
		await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

		expect(screen.queryByRole('alert')).toBeNull()

		liberar({ status: 200, data: {} })
		await waitFor(() =>
			expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeEnabled(),
		)
		red.restaurar()
	})

	it('permite reintentar tras un fallo sin recargar la aplicación', async () => {
		let intento = 0
		const red = simularRed(() => {
			intento += 1
			return intento === 1
				? { status: 401, data: {} }
				: { status: 200, data: {} }
		}, [axios, clientAxios])
		const usuario = userEvent.setup()

		renderLogin()
		await usuario.type(screen.getByLabelText('RUT'), '12.345.678-5')
		await usuario.type(screen.getByLabelText('Contraseña'), 'clave')
		await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
		await screen.findByRole('alert')

		await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

		await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
		expect(intento).toBe(2)
		red.restaurar()
	})
})
