'use client'

import PanelEjecutivoComercial from '@/components/paneles/ejecutivo-comercial/panel-ejecutivo-comercial'
import { useAuthStore } from '@/global_states/auth-store'
import { useCallback } from 'react'

export default function Home() {
	const { usuario } = useAuthStore()

	const tieneRol = useCallback(
		(codigoRol: string) => {
			return usuario?.roles.find(rol => rol.codigo === codigoRol)
		},
		[usuario],
	)

	return <>{tieneRol('EJECUTIVO_COMERCIAL') && <PanelEjecutivoComercial />}</>
}
