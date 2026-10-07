import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { decodificarAccessToken } from '@/lib/refresh-tokens'

export const clientAxios = axios.create()

/** Evita bucles infinitos: solo un intento de refresh por request fallida. */
let refreshEnProgreso = false
let refreshPromise: Promise<boolean> | null = null

/**
 * Intenta refrescar el access token una sola vez.
 * Si ya hay un refresh en curso, reutiliza la misma promesa (colapso de requests).
 *
 * Tras un refresh exitoso, despacha `session-refreshed` con el nuevo payload
 * para que AuthContext actualice el usuario inmediatamente.
 */
async function intentarRefresh(): Promise<boolean> {
	if (refreshEnProgreso && refreshPromise) {
		return refreshPromise
	}

	refreshEnProgreso = true
	refreshPromise = (async () => {
		try {
			const res = await fetch('/api/auth/refresh', { method: 'POST' })
			if (!res.ok) return false

			// Despachar el payload actualizado para que AuthContext se sincronice
			try {
				const data = await res.clone().json()
				if (data.access_token) {
					const payload = decodificarAccessToken(data.access_token)
					if (payload) {
						window.dispatchEvent(
							new CustomEvent('session-refreshed', { detail: payload }),
						)
					}
				}
			} catch {
				// El body no es JSON o el token no se pudo decodificar;
				// el refresh igual fue exitoso, el contexto se actualizará
				// en el próximo obtenerSesion() o router.refresh().
			}

			return true
		} catch {
			return false
		} finally {
			refreshEnProgreso = false
			refreshPromise = null
		}
	})()

	return refreshPromise
}

function redirigirALogin() {
	window.dispatchEvent(new Event('session-expired'))
	window.location.replace('/api/auth/logout?redirect=/login')
}

async function manejar401(error: AxiosError) {
	const config = error.config as AxiosRequestConfig & { _retry?: boolean }
	const url = config?.url || ''

	// No refrescar para endpoints de auth (evita bucles)
	if (url.startsWith('/api/auth/')) {
		return Promise.reject(error)
	}

	// No reintentar dos veces la misma request
	if (config?._retry) {
		redirigirALogin()
		return Promise.reject(error)
	}

	config._retry = true

	const exito = await intentarRefresh()
	if (exito) {
		// Reintentar la request original (las nuevas cookies ya están seteadas)
		return axios(config)
	}

	redirigirALogin()
	return Promise.reject(error)
}

function instalarInterceptor(instancia: typeof axios | typeof clientAxios) {
	instancia.interceptors.response.use(
		response => response,
		error => {
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				return manejar401(error)
			}

			return Promise.reject(error)
		},
	)
}

instalarInterceptor(axios)
instalarInterceptor(clientAxios)
