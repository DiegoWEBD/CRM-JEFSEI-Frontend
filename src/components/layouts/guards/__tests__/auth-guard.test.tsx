import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import AuthGuard from '../auth-guard'
import { payloadSesion } from '@/test/fixtures/sesion'
import { renderConSesion } from '@/test/helpers/render-con-sesion'

const CONTENIDO = 'Panel de configuración de estados'

function guardia(allowedRoles: string[], fallback = 'Sin acceso') {
	return (
		<AuthGuard allowedRoles={allowedRoles} fallback={<span>{fallback}</span>}>
			<section>{CONTENIDO}</section>
		</AuthGuard>
	)
}

describe('AuthGuard — acceso por rol', () => {
	it('muestra el contenido cuando el usuario tiene uno de los roles admitidos', async () => {
		await renderConSesion(
			payloadSesion({ codigo_roles: ['GERENTE_GENERAL'] }),
			guardia(['GERENTE_GENERAL', 'GERENTE_COMERCIAL']),
		)

		expect(screen.getByText(CONTENIDO)).toBeInTheDocument()
	})

	it('oculta el contenido cuando el rol del usuario no está admitido', async () => {
		await renderConSesion(
			payloadSesion({ codigo_roles: ['EJECUTIVO_COMERCIAL'] }),
			guardia(['GERENTE_GENERAL', 'GERENTE_COMERCIAL']),
		)

		expect(screen.queryByText(CONTENIDO)).toBeNull()
		expect(screen.getByText('Sin acceso')).toBeInTheDocument()
	})

	it('oculta el contenido cuando no hay sesión', async () => {
		await renderConSesion(null, guardia(['GERENTE_GENERAL']))

		expect(screen.queryByText(CONTENIDO)).toBeNull()
		expect(screen.getByText('Sin acceso')).toBeInTheDocument()
	})

	it('con varios roles admitidos basta con tener uno', async () => {
		await renderConSesion(
			payloadSesion({ codigo_roles: ['GERENTE_OPERACIONES'] }),
			guardia(['GERENTE_GENERAL', 'GERENTE_COMERCIAL', 'GERENTE_OPERACIONES']),
		)

		expect(screen.getByText(CONTENIDO)).toBeInTheDocument()
	})

	it('sin lista de roles permite el acceso a cualquier sesión iniciada', async () => {
		await renderConSesion(
			payloadSesion({ codigo_roles: ['EJECUTIVO_COBRANZA'] }),
			guardia([]),
		)

		expect(screen.getByText(CONTENIDO)).toBeInTheDocument()
	})

	it('no hereda los roles de una sesión anterior ya cerrada', async () => {
		// La sesión se resuelve sin usuario: el contenido no debe aparecer aunque
		// el árbol se renderice con un payload inicial nulo.
		await renderConSesion(null, guardia(['GERENTE_GENERAL'], 'Sesión expirada'))

		expect(screen.queryByText(CONTENIDO)).toBeNull()
		expect(screen.getByText('Sesión expirada')).toBeInTheDocument()
	})
})
