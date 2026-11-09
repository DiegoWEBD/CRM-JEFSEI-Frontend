import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import ErrorFallback from '../error-fallback'
import { DIGEST_SIN_PERMISOS, marcarErrorSinPermisos, UnauthorizedError } from '@/lib/errores'

function errorSerializadoDeServidor(): Error & { digest?: string } {
	// Así llega un error de Server Component a error.tsx: serializado, solo con
	// el digest intacto y sin las propiedades originales (p. ej. response).
	return Object.assign(new Error('Request failed with status code 403'), {
		digest: DIGEST_SIN_PERMISOS,
	})
}

function errorHttpDeCliente(status: number): AxiosError {
	const config = { url: '/api/prospectos' } as AxiosRequestConfig as AxiosResponse['config']
	const response: AxiosResponse = {
		data: {},
		status,
		statusText: '',
		headers: {},
		config,
		request: null,
	}
	return new AxiosError('Request failed', String(status), config, null, response)
}

function error403DeCliente(): AxiosError {
	return marcarErrorSinPermisos(errorHttpDeCliente(403))
}

describe('ErrorFallback — vista de sin permisos', () => {
	it('muestra la vista de sin permisos ante un 403 serializado desde el servidor', () => {
		render(<ErrorFallback error={errorSerializadoDeServidor()} reset={() => {}} />)

		expect(screen.getByRole('heading', { name: 'Sin permisos' })).toBeInTheDocument()
		expect(
			screen.getByText(/No tienes permiso para acceder a este recurso/),
		).toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'Volver al inicio' })).toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull()
	})

	it('muestra la vista de sin permisos ante un 403 de axios en el cliente', () => {
		render(<ErrorFallback error={error403DeCliente()} reset={() => {}} />)

		expect(screen.getByRole('heading', { name: 'Sin permisos' })).toBeInTheDocument()
	})

	it('muestra la vista de sin permisos ante un UnauthorizedError', () => {
		render(<ErrorFallback error={new UnauthorizedError()} reset={() => {}} />)

		expect(screen.getByRole('heading', { name: 'Sin permisos' })).toBeInTheDocument()
	})

	it('ante un 401 de axios muestra la vista de sin permisos', () => {
		render(<ErrorFallback error={errorHttpDeCliente(401)} reset={() => {}} />)

		expect(screen.getByRole('heading', { name: 'Sin permisos' })).toBeInTheDocument()
	})
})

describe('ErrorFallback — errores que no son de permisos', () => {
	it('muestra la vista genérica con opción de reintentar', async () => {
		const reset = vi.fn()
		const usuario = userEvent.setup()
		render(<ErrorFallback error={new Error('boom')} reset={reset} />)

		expect(screen.getByRole('heading', { name: 'Error' })).toBeInTheDocument()
		expect(
			screen.getByText('Ocurrió un error al cargar este recurso.'),
		).toBeInTheDocument()

		await usuario.click(screen.getByRole('button', { name: 'Reintentar' }))
		expect(reset).toHaveBeenCalledTimes(1)
	})

	it('ante un 500 de axios no muestra la vista de sin permisos', () => {
		render(<ErrorFallback error={errorHttpDeCliente(500)} reset={() => {}} />)

		expect(screen.queryByRole('heading', { name: 'Sin permisos' })).toBeNull()
		expect(screen.getByRole('heading', { name: 'Error' })).toBeInTheDocument()
	})
})
