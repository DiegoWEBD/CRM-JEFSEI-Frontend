'use client'

import { useAuthContext } from '@/contexts/auth-context'
import { useCanalNotificaciones } from '@/hooks/notificaciones/use-canal-notificaciones'

/**
 * Abre el WebSocket que avisa al cliente cuándo refrescar las alertas
 * (reemplaza al `refetchInterval` del contador). No renderiza nada: va
 * montado en `Providers`, dentro del `AuthProvider`.
 */
export default function CanalNotificaciones() {
	const { tienePermiso } = useAuthContext()

	useCanalNotificaciones({ habilitado: tienePermiso('VER_ALERTAS') })

	return null
}
