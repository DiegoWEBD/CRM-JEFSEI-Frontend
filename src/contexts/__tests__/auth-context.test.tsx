import { act, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useAuthContext } from '@/contexts/auth-context'
import { payloadSesion, codificarJwt } from '@/test/fixtures/sesion'
import { renderConSesion } from '@/test/helpers/render-con-sesion'

/** Sonda que expone el resultado de cada predicado de autorización. */
function Sonda() {
	const u = useAuthContext()
	return (
		<div>
			<span data-testid="usuario">{u.usuario?.nombre ?? 'sin sesión'}</span>
			<span data-testid="rol">
				{String(u.tieneAlgunRol(['GERENTE_GENERAL', 'GERENTE_COMERCIAL']))}
			</span>
			<span data-testid="permiso">{String(u.tienePermiso('CANCELAR_POLIZA'))}</span>
			<span data-testid="algun-permiso">
				{String(
					u.tieneAlgunPermiso(['CANCELAR_POLIZA', 'REACTIVAR_POLIZA']),
				)}
			</span>
			<span data-testid="todos-los-permisos">
				{String(
					u.tieneTodosLosPermisos(['CANCELAR_POLIZA', 'REACTIVAR_POLIZA']),
				)}
			</span>
		</div>
	)
}

const SESION_GERENTE = payloadSesion({
	nombre: 'Gerente de Prueba',
	codigo_roles: ['GERENTE_GENERAL'],
	codigo_permisos: ['CANCELAR_POLIZA'],
})

function valor(testid: string) {
	return screen.getByTestId(testid).textContent
}

describe('AuthContext — predicados de autorización', () => {
	it('evalúa permisos y roles exactamente contra los códigos del JWT', async () => {
		await renderConSesion(SESION_GERENTE, <Sonda />)

		expect(valor('usuario')).toBe('Gerente de Prueba')
		expect(valor('rol')).toBe('true')
		expect(valor('permiso')).toBe('true')
		expect(valor('algun-permiso')).toBe('true')
	})

	it('tieneAlgunPermiso es un OR: basta con uno de los permisos listados', async () => {
		await renderConSesion(SESION_GERENTE, <Sonda />)

		expect(valor('algun-permiso')).toBe('true')
	})

	it('tieneTodosLosPermisos es un AND: exige la totalidad', async () => {
		await renderConSesion(SESION_GERENTE, <Sonda />)

		// Tiene CANCELAR_POLIZA pero no REACTIVAR_POLIZA.
		expect(valor('todos-los-permisos')).toBe('false')
	})

	it('sin sesión todos los predicados son falsos', async () => {
		await renderConSesion(null, <Sonda />)

		expect(valor('usuario')).toBe('sin sesión')
		expect(valor('rol')).toBe('false')
		expect(valor('permiso')).toBe('false')
		expect(valor('algun-permiso')).toBe('false')
		expect(valor('todos-los-permisos')).toBe('false')
	})
})

describe('AuthContext — ciclo de vida de la sesión', () => {
	it('descarta el payload inicial cuando el servidor dice que la sesión ya no existe', async () => {
		// El servidor responde 401: los datos del usuario anterior no deben quedar.
		await renderConSesion(null, <Sonda />)

		expect(valor('usuario')).toBe('sin sesión')
	})

	it('limpia el usuario al recibir session-expired, sin dejar datos del usuario anterior', async () => {
		await renderConSesion(SESION_GERENTE, <Sonda />)
		expect(valor('usuario')).toBe('Gerente de Prueba')

		await act(async () => {
			window.dispatchEvent(new Event('session-expired'))
		})

		expect(valor('usuario')).toBe('sin sesión')
		expect(valor('permiso')).toBe('false')
		expect(valor('rol')).toBe('false')
	})

	it('actualiza el usuario al recibir session-refreshed con el nuevo payload', async () => {
		await renderConSesion(SESION_GERENTE, <Sonda />)
		expect(valor('usuario')).toBe('Gerente de Prueba')

		const renovada = payloadSesion({
			nombre: 'Gerente Renovado',
			codigo_permisos: ['CANCELAR_POLIZA', 'REACTIVAR_POLIZA'],
		})

		await act(async () => {
			window.dispatchEvent(
				new CustomEvent('session-refreshed', { detail: renovada }),
			)
		})

		expect(valor('usuario')).toBe('Gerente Renovado')
		expect(valor('todos-los-permisos')).toBe('true')
	})

	it('no reacciona a un session-refreshed sin payload', async () => {
		await renderConSesion(SESION_GERENTE, <Sonda />)

		await act(async () => {
			window.dispatchEvent(new CustomEvent('session-refreshed', {}))
		})

		expect(valor('usuario')).toBe('Gerente de Prueba')
	})
})

describe('AuthProvider — datos que no se filtran al cliente', () => {
	it('el token crudo nunca se expone en el estado del contexto', async () => {
		const jwt = codificarJwt(SESION_GERENTE)

		function SondaToken() {
			const u = useAuthContext()
			return <span data-testid="estado">{JSON.stringify(u.usuario)}</span>
		}

		const { container } = await renderConSesion(SESION_GERENTE, <SondaToken />)

		expect(container.textContent).not.toContain(jwt)
		expect(container.textContent).not.toContain('firma-sintetica')
	})
})
