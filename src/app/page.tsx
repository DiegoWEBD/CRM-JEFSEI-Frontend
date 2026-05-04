'use client'

import PanelEjecutivoComercial from '@/components/paneles/ejecutivo-comercial/panel-ejecutivo-comercial'
import { useAuthStore } from '@/global_states/auth_store'

export default function Home() {
	const { usuario } = useAuthStore()
	return (
		<>
			{usuario?.roles.includes('Ejecutivo Comercial') && (
				<PanelEjecutivoComercial />
			)}
		</>
	)
}
