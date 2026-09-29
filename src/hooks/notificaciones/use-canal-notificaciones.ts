'use client'

import { EventoCanalNotificaciones } from '@/types/notificaciones/notificacion'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect } from 'react'

const EVENTO_ACTUALIZACION = 'notificaciones_actualizadas'
const RETRASO_BASE_MS = 1_000
const RETRASO_MAXIMO_MS = 30_000
const CODIGO_NO_AUTORIZADO = 1008

type OpcionesCanalNotificaciones = {
	/**
	 * Solo abre el canal quien tenga `VER_ALERTAS`. El backend lo vuelve a
	 * validar al conectar, esto evita el ida y vuelta inútil.
	 */
	habilitado?: boolean
}

/** `http(s)://` → `ws(s)://` para hablar directo con FastAPI. */
const aUrlWebSocket = (base: string | undefined): string =>
	(base || 'ws://localhost:8000').replace(/^http/, 'ws')

export const useCanalNotificaciones = ({
	habilitado = true,
}: OpcionesCanalNotificaciones = {}) => {
	const queryClient = useQueryClient()

	useEffect(() => {
		if (!habilitado || typeof window === 'undefined') return

		let cancelado = false
		let socket: WebSocket | null = null
		let reintento: ReturnType<typeof setTimeout> | null = null
		let intentos = 0
		let haConectado = false

		function invalidarNotificaciones() {
			queryClient.invalidateQueries({ queryKey: ['notificaciones'] })
		}

		function programarReintento() {
			if (cancelado || reintento) return
			const espera = Math.min(RETRASO_BASE_MS * 2 ** intentos, RETRASO_MAXIMO_MS)
			intentos += 1
			reintento = setTimeout(() => {
				reintento = null
				conectar()
			}, espera)
		}

		async function conectar() {
			if (cancelado) return

			// El ticket dura 60 s: se pide uno nuevo en cada (re)conexión.
			let ticket: string
			try {
				const respuesta = await axios.post<{ ticket: string }>(
					'/api/auth/ws-ticket',
				)
				ticket = respuesta.data.ticket
			} catch (error) {
				const estado = axios.isAxiosError(error)
					? error.response?.status
					: undefined
				// Sesión vencida o sin permiso: reintentar no va a cambiar nada.
				if (estado === 401 || estado === 403) return
				programarReintento()
				return
			}

			if (cancelado) return

			const ws = new WebSocket(
				`${aUrlWebSocket(process.env.NEXT_PUBLIC_API_URL)}/ws/notificaciones?ticket=${encodeURIComponent(ticket)}`,
			)
			socket = ws

			ws.onopen = () => {
				intentos = 0
				// Tras una reconexión pudo perderse algún aviso: refresca igual.
				if (haConectado) invalidarNotificaciones()
				haConectado = true
			}

			ws.onmessage = evento => {
				try {
					const datos = JSON.parse(evento.data) as EventoCanalNotificaciones
					if (datos.evento === EVENTO_ACTUALIZACION) invalidarNotificaciones()
				} catch {
					// Mensaje no JSON (p. ej. el ping del servidor): se ignora.
				}
			}

			ws.onerror = () => ws.close()

			ws.onclose = evento => {
				if (cancelado || socket !== ws) return
				socket = null
				// 1008 = origen, ticket o permiso rechazado: reintentar no ayuda.
				if (evento.code === CODIGO_NO_AUTORIZADO) return
				programarReintento()
			}
		}

		conectar()

		return () => {
			cancelado = true
			if (reintento) clearTimeout(reintento)
			socket?.close()
		}
	}, [habilitado, queryClient])
}
